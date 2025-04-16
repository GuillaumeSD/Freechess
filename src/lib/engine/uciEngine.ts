import { EngineName } from "@/types/enums";
import {
  EvaluateGameParams,
  EvaluatePositionWithUpdateParams,
  GameEval,
  PositionEval,
} from "@/types/eval";
import {
  getResultProperty,
  parseEvaluationResults,
} from "./helpers/parseResults";
import { computeAccuracy } from "./helpers/accuracy";
import { getIsStalemate, getWhoIsCheckmated } from "../chess";
import { getLichessEval } from "../lichess";
import { getMovesClassification } from "./helpers/moveClassification";
import { EngineWorker } from "@/types/engine";

type WorkerJob = {
  commands: string[];
  finalMessage: string;
  onNewMessage?: (messages: string[]) => void;
  resolve: (messages: string[]) => void;
};

export class UciEngine {
  private workers: EngineWorker[];
  private isBusy: boolean[] = [];
  private workerQueue: WorkerJob[] = [];
  private ready = false;
  private engineName: EngineName;
  private multiPv = 3;
  private skillLevel: number | undefined = undefined;

  private constructor(engineName: EngineName, workers: EngineWorker[]) {
    this.engineName = engineName;
    this.workers = workers;
    this.isBusy = new Array(workers.length).fill(false);
  }

  public static async create(
    engineName: EngineName,
    workers: EngineWorker[],
    customEngineInit?: (
      sendCommands: UciEngine["sendCommands"]
    ) => Promise<void>
  ): Promise<UciEngine> {
    const engine = new UciEngine(engineName, workers);

    await engine.broadcastCommands(["uci"], "uciok");
    await engine.setMultiPv(engine.multiPv, true);
    await customEngineInit?.(engine.sendCommands.bind(engine));
    engine.ready = true;

    console.log(`${engineName} initialized`);
    return engine;
  }

  private acquireWorker(): { index: number; worker: EngineWorker } | undefined {
    for (let i = 0; i < this.workers.length; i++) {
      if (!this.isBusy[i]) {
        this.isBusy[i] = true;
        return { index: i, worker: this.workers[i] };
      }
    }

    return undefined;
  }

  private releaseWorker(index: number) {
    this.isBusy[index] = false;

    if (this.workerQueue.length > 0) {
      const nextJob = this.workerQueue.shift()!;
      this.sendCommands(
        nextJob.commands,
        nextJob.finalMessage,
        nextJob.onNewMessage
      ).then(nextJob.resolve);
    }
  }

  private async setMultiPv(multiPv: number, initCase = false) {
    if (!initCase) {
      if (multiPv === this.multiPv) return;

      this.throwErrorIfNotReady();
    }

    if (multiPv < 2 || multiPv > 6) {
      throw new Error(`Invalid MultiPV value : ${multiPv}`);
    }

    await this.broadcastCommands(
      [`setoption name MultiPV value ${multiPv}`, "isready"],
      "readyok"
    );

    this.multiPv = multiPv;
  }

  private async setSkillLevel(skillLevel: number, initCase = false) {
    if (!initCase) {
      if (skillLevel === this.skillLevel) return;

      this.throwErrorIfNotReady();
    }

    if (skillLevel < 0 || skillLevel > 20) {
      throw new Error(`Invalid SkillLevel value : ${skillLevel}`);
    }

    await this.sendCommands(
      [`setoption name Skill Level value ${skillLevel}`, "isready"],
      "readyok"
    );

    this.skillLevel = skillLevel;
  }

  private throwErrorIfNotReady() {
    if (!this.ready) {
      throw new Error(`${this.engineName} is not ready`);
    }
  }

  public shutdown(): void {
    this.ready = false;

    for (const worker of this.workers) {
      worker.uci("quit");
      worker.terminate?.();
    }

    this.isBusy = Array(this.workers.length).fill(false);
    this.workerQueue = [];

    console.log(`${this.engineName} shutdown`);
  }

  public isReady(): boolean {
    return this.ready;
  }

  public async stopSearch(): Promise<void> {
    await this.sendCommands(["stop", "isready"], "readyok");
  }

  private async sendCommands(
    commands: string[],
    finalMessage: string,
    onNewMessage?: (messages: string[]) => void
  ): Promise<string[]> {
    const acquired = this.acquireWorker();
    if (!acquired) {
      return new Promise((resolve) => {
        this.workerQueue.push({
          commands,
          finalMessage,
          onNewMessage,
          resolve,
        });
      });
    }
    return new Promise((resolve) => {
      const messages: string[] = [];
      acquired.worker.listen = (data) => {
        messages.push(data);
        onNewMessage?.(messages);

        if (data.startsWith(finalMessage)) {
          this.releaseWorker(acquired.index);
          resolve(messages);
        }
      };
      for (const command of commands) {
        acquired.worker.uci(command);
      }
    });
  }

  private async sendCommandsToWorker(
    worker: EngineWorker,
    commands: string[],
    finalMessage: string,
    onNewMessage?: (messages: string[]) => void
  ): Promise<string[]> {
    return new Promise((resolve) => {
      const messages: string[] = [];
      worker.listen = (data) => {
        messages.push(data);
        onNewMessage?.(messages);
        if (data.startsWith(finalMessage)) {
          resolve(messages);
        }
      };
      for (const command of commands) {
        worker.uci(command);
      }
    });
  }

  private broadcastCommands(
    commands: string[],
    finalMessage: string,
    onNewMessage?: (messages: string[]) => void
  ): Promise<string[]>[] {
    return this.workers.map((worker) =>
      this.sendCommandsToWorker(worker, commands, finalMessage, onNewMessage)
    );
  }

  public async evaluateGame({
    fens,
    uciMoves,
    depth = 16,
    multiPv = this.multiPv,
    setEvaluationProgress,
  }: EvaluateGameParams): Promise<GameEval> {
    this.throwErrorIfNotReady();
    setEvaluationProgress?.(1);
    await this.setMultiPv(multiPv);
    this.ready = false;

    await this.sendCommands(
      ["ucinewgame", "position startpos", "isready"],
      "readyok"
    );

    const positions: PositionEval[] = new Array(fens.length);
    let completed = 0;

    const updateProgress = () => {
      const progress = completed / fens.length;
      setEvaluationProgress?.(99 - Math.exp(-4 * progress) * 99);
    };

    await Promise.all(
      fens.map(async (fen, i) => {
        const whoIsCheckmated = getWhoIsCheckmated(fen);
        if (whoIsCheckmated) {
          positions[i] = {
            lines: [
              {
                pv: [],
                depth: 0,
                multiPv: 1,
                mate: whoIsCheckmated === "w" ? -1 : 1,
              },
            ],
          };
          completed++;
          updateProgress();
          return;
        }

        const isStalemate = getIsStalemate(fen);
        if (isStalemate) {
          positions[i] = {
            lines: [
              {
                pv: [],
                depth: 0,
                multiPv: 1,
                cp: 0,
              },
            ],
          };
          completed++;
          updateProgress();
          return;
        }

        const result = await this.evaluatePosition(fen, depth);
        positions[i] = result;
        completed++;
        updateProgress();
      })
    );

    const positionsWithClassification = getMovesClassification(
      positions,
      uciMoves,
      fens
    );
    const accuracy = computeAccuracy(positions);

    this.ready = true;
    return {
      positions: positionsWithClassification,
      accuracy,
      settings: {
        engine: this.engineName,
        date: new Date().toISOString(),
        depth,
        multiPv,
      },
    };
  }

  private async evaluatePosition(
    fen: string,
    depth = 16
  ): Promise<PositionEval> {
    console.log(`Evaluating position: ${fen}`);

    const lichessEval = await getLichessEval(fen, this.multiPv);
    if (
      lichessEval.lines.length >= this.multiPv &&
      lichessEval.lines[0].depth >= depth
    ) {
      return lichessEval;
    }

    const results = await this.sendCommands(
      [`position fen ${fen}`, `go depth ${depth}`],
      "bestmove"
    );

    const whiteToPlay = fen.split(" ")[1] === "w";

    return parseEvaluationResults(results, whiteToPlay);
  }

  public async evaluatePositionWithUpdate({
    fen,
    depth = 16,
    multiPv = this.multiPv,
    setPartialEval,
  }: EvaluatePositionWithUpdateParams): Promise<PositionEval> {
    this.throwErrorIfNotReady();

    const lichessEvalPromise = getLichessEval(fen, multiPv);

    await this.stopSearch();
    await this.setMultiPv(multiPv);

    const whiteToPlay = fen.split(" ")[1] === "w";

    const onNewMessage = (messages: string[]) => {
      if (!setPartialEval) return;
      const parsedResults = parseEvaluationResults(messages, whiteToPlay);
      setPartialEval(parsedResults);
    };

    console.log(`Evaluating position: ${fen}`);

    const lichessEval = await lichessEvalPromise;
    if (
      lichessEval.lines.length >= multiPv &&
      lichessEval.lines[0].depth >= depth
    ) {
      setPartialEval?.(lichessEval);
      return lichessEval;
    }

    const results = await this.sendCommands(
      [`position fen ${fen}`, `go depth ${depth}`],
      "bestmove",
      onNewMessage
    );

    return parseEvaluationResults(results, whiteToPlay);
  }

  public async getEngineNextMove(
    fen: string,
    skillLevel: number,
    depth = 16
  ): Promise<string | undefined> {
    this.throwErrorIfNotReady();
    await this.setSkillLevel(skillLevel);

    console.log(`Evaluating position: ${fen}`);

    const results = await this.sendCommands(
      [`position fen ${fen}`, `go depth ${depth}`],
      "bestmove"
    );

    const moveResult = results.find((result) => result.startsWith("bestmove"));
    const move = getResultProperty(moveResult ?? "", "bestmove");
    if (!move) {
      throw new Error("No move found");
    }

    return move === "(none)" ? undefined : move;
  }
}
