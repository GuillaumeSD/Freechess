import { EngineName } from "@/types/enums";
import {
  EvaluateGameParams,
  EvaluatePositionWithUpdateParams,
  GameEval,
  PositionEval,
} from "@/types/eval";
import { parseEvaluationResults } from "./helpers/parseResults";
import { computeAccuracy } from "./helpers/accuracy";
import { getWhoIsCheckmated } from "../chess";
import { getLichessEval } from "../lichess";
import { getMovesClassification } from "./helpers/moveClassification";

export abstract class UciEngine {
  private worker: Worker;
  private ready = false;
  private engineName: EngineName;
  private multiPv = 3;

  constructor(engineName: EngineName, enginePath: string) {
    this.engineName = engineName;
    this.worker = new Worker(enginePath);

    console.log(`${engineName} created`);
  }

  public async init(): Promise<void> {
    await this.sendCommands(["uci"], "uciok");
    await this.setMultiPv(this.multiPv, true);
    this.ready = true;
    console.log(`${this.engineName} initialized`);
  }

  private async setMultiPv(multiPv: number, initCase = false) {
    if (!initCase) {
      if (multiPv === this.multiPv) return;

      this.throwErrorIfNotReady();
    }

    if (multiPv < 1 || multiPv > 6) {
      throw new Error(`Invalid MultiPV value : ${multiPv}`);
    }

    await this.sendCommands(
      [`setoption name MultiPV value ${multiPv}`, "isready"],
      "readyok"
    );

    this.multiPv = multiPv;
  }

  private throwErrorIfNotReady() {
    if (!this.ready) {
      throw new Error(`${this.engineName} is not ready`);
    }
  }

  public shutdown(): void {
    this.ready = false;
    this.worker.postMessage("quit");
    this.worker.terminate();
    console.log(`${this.engineName} shutdown`);
  }

  public isReady(): boolean {
    return this.ready;
  }

  private async stopSearch(): Promise<void> {
    await this.sendCommands(["stop", "isready"], "readyok");
  }

  private async sendCommands(
    commands: string[],
    finalMessage: string,
    onNewMessage?: (messages: string[]) => void
  ): Promise<string[]> {
    return new Promise((resolve) => {
      const messages: string[] = [];

      this.worker.onmessage = (event) => {
        const messageData: string = event.data;
        messages.push(messageData);
        onNewMessage?.(messages);

        if (messageData.startsWith(finalMessage)) {
          resolve(messages);
        }
      };

      for (const command of commands) {
        this.worker.postMessage(command);
      }
    });
  }

  public async evaluateGame({
    fens,
    uciMoves,
    depth = 16,
    multiPv = this.multiPv,
  }: EvaluateGameParams): Promise<GameEval> {
    this.throwErrorIfNotReady();
    await this.setMultiPv(multiPv);
    this.ready = false;

    await this.sendCommands(["ucinewgame", "isready"], "readyok");
    this.worker.postMessage("position startpos");

    const positions: PositionEval[] = [];
    for (const fen of fens) {
      const whoIsCheckmated = getWhoIsCheckmated(fen);
      if (whoIsCheckmated) {
        positions.push({
          lines: [
            {
              pv: [],
              depth: 0,
              multiPv: 1,
              mate: whoIsCheckmated === "w" ? -1 : 1,
            },
          ],
        });
        continue;
      }
      const result = await this.evaluatePosition(fen, depth);
      positions.push(result);
    }

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
  }: EvaluatePositionWithUpdateParams): Promise<void> {
    this.throwErrorIfNotReady();

    const lichessEvalPromise = getLichessEval(fen, multiPv);

    await this.stopSearch();
    await this.setMultiPv(multiPv);

    const whiteToPlay = fen.split(" ")[1] === "w";

    const onNewMessage = (messages: string[]) => {
      const parsedResults = parseEvaluationResults(messages, whiteToPlay);
      setPartialEval(parsedResults);
    };

    console.log(`Evaluating position: ${fen}`);

    const lichessEval = await lichessEvalPromise;
    if (
      lichessEval.lines.length >= multiPv &&
      lichessEval.lines[0].depth >= depth
    ) {
      setPartialEval(lichessEval);
      return;
    }

    await this.sendCommands(
      [`position fen ${fen}`, `go depth ${depth}`],
      "bestmove",
      onNewMessage
    );
  }
}
