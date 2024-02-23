import { Engine } from "@/types/enums";
import { GameEval, LineEval, MoveEval } from "@/types/eval";

export class Stockfish {
  private worker: Worker;
  private ready = false;

  constructor() {
    this.worker = new Worker(
      this.isWasmSupported()
        ? "engines/stockfish-wasm/stockfish-nnue-16-single.js"
        : "engines/stockfish.js"
    );

    console.log("Stockfish created");
  }

  public isWasmSupported() {
    return (
      typeof WebAssembly === "object" &&
      WebAssembly.validate(
        Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00)
      )
    );
  }

  public async init(): Promise<void> {
    await this.sendCommands(["uci"], "uciok");
    await this.setMultiPv(3, false);
    this.ready = true;
    console.log("Stockfish initialized");
  }

  public async setMultiPv(multiPv: number, checkIsReady = true) {
    if (checkIsReady) {
      this.throwErrorIfNotReady();
    }

    if (multiPv < 1 || multiPv > 6) {
      throw new Error(`Invalid MultiPV value : ${multiPv}`);
    }

    await this.sendCommands(
      [`setoption name MultiPV value ${multiPv}`, "isready"],
      "readyok"
    );
  }

  private throwErrorIfNotReady() {
    if (!this.ready) {
      throw new Error("Stockfish is not ready");
    }
  }

  public shutdown(): void {
    this.ready = false;
    this.worker.postMessage("quit");
    this.worker.terminate();
    console.log("Stockfish shutdown");
  }

  public isReady(): boolean {
    return this.ready;
  }

  private async sendCommands(
    commands: string[],
    finalMessage: string
  ): Promise<string[]> {
    return new Promise((resolve) => {
      const messages: string[] = [];
      this.worker.onmessage = (event) => {
        const messageData: string = event.data;
        messages.push(messageData);
        if (messageData.startsWith(finalMessage)) {
          resolve(messages);
        }
      };

      for (const command of commands) {
        this.worker.postMessage(command);
      }
    });
  }

  public async evaluateGame(
    fens: string[],
    depth = 16,
    multiPv = 3
  ): Promise<GameEval> {
    this.throwErrorIfNotReady();
    this.ready = false;

    await this.setMultiPv(multiPv, false);
    await this.sendCommands(["ucinewgame", "isready"], "readyok");
    this.worker.postMessage("position startpos");

    const moves: MoveEval[] = [];
    for (const fen of fens) {
      console.log(`Evaluating position: ${fen}`);
      const result = await this.evaluatePosition(fen, depth, false);
      moves.push(result);
    }

    this.ready = true;
    console.log(moves);
    return {
      moves,
      accuracy: { white: 82.34, black: 67.49 }, // TODO: Calculate accuracy
      settings: {
        name: Engine.Stockfish16,
        date: new Date().toISOString(),
        depth,
        multiPv,
      },
    };
  }

  public async evaluatePosition(
    fen: string,
    depth = 16,
    checkIsReady = true
  ): Promise<MoveEval> {
    if (checkIsReady) {
      this.throwErrorIfNotReady();
    }

    const results = await this.sendCommands(
      [`position fen ${fen}`, `go depth ${depth}`],
      "bestmove"
    );

    const parsedResults = this.parseResults(results);

    const whiteToPlay = fen.split(" ")[1] === "w";

    if (!whiteToPlay) {
      const lines = parsedResults.lines.map((line) => ({
        ...line,
        cp: line.cp ? -line.cp : line.cp,
      }));

      return {
        ...parsedResults,
        lines,
      };
    }

    return parsedResults;
  }

  private parseResults(results: string[]): MoveEval {
    const parsedResults: MoveEval = {
      bestMove: "",
      lines: [],
    };
    const tempResults: Record<string, LineEval> = {};

    for (const result of results) {
      if (result.startsWith("bestmove")) {
        const bestMove = this.getResultProperty(result, "bestmove");
        if (bestMove) {
          parsedResults.bestMove = bestMove;
        }
      }

      if (result.startsWith("info")) {
        const pv = this.getResultPv(result);
        const multiPv = this.getResultProperty(result, "multipv");
        const depth = this.getResultProperty(result, "depth");
        if (!pv || !multiPv || !depth) continue;

        if (
          tempResults[multiPv] &&
          parseInt(depth) < tempResults[multiPv].depth
        ) {
          continue;
        }

        const cp = this.getResultProperty(result, "cp");
        const mate = this.getResultProperty(result, "mate");

        tempResults[multiPv] = {
          pv,
          cp: cp ? parseInt(cp) : undefined,
          mate: mate ? parseInt(mate) : undefined,
          depth: parseInt(depth),
          multiPv: parseInt(multiPv),
        };
      }
    }

    parsedResults.lines = Object.values(tempResults).sort(this.sortLines);

    return parsedResults;
  }

  private sortLines(a: LineEval, b: LineEval): number {
    if (a.mate !== undefined && b.mate !== undefined) {
      return a.mate - b.mate;
    }

    if (a.mate !== undefined) {
      return -a.mate;
    }

    if (b.mate !== undefined) {
      return b.mate;
    }

    return (b.cp ?? 0) - (a.cp ?? 0);
  }

  private getResultProperty(
    result: string,
    property: string
  ): string | undefined {
    const splitResult = result.split(" ");
    const propertyIndex = splitResult.indexOf(property);

    if (propertyIndex === -1 || propertyIndex + 1 >= splitResult.length) {
      return undefined;
    }

    return splitResult[propertyIndex + 1];
  }

  private getResultPv(result: string): string[] | undefined {
    const splitResult = result.split(" ");
    const pvIndex = splitResult.indexOf("pv");

    if (pvIndex === -1 || pvIndex + 1 >= splitResult.length) {
      return undefined;
    }

    return splitResult.slice(pvIndex + 1);
  }
}
