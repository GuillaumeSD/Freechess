import { GameEval, MoveEval } from "@/types/eval";

export class Stockfish {
  private worker: Worker;
  private ready: boolean = false;

  constructor() {
    this.worker = new Worker(
      this.isWasmSupported()
        ? "engines/stockfish.wasm.js"
        : "engines/stockfish.js"
    );

    console.log("Stockfish created");
  }

  public isWasmSupported(): boolean {
    return (
      typeof WebAssembly === "object" &&
      WebAssembly.validate(
        Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00)
      )
    );
  }

  public async init(): Promise<void> {
    await this.sendCommands(["uci"], "uciok");
    await this.sendCommands(
      ["setoption name MultiPV value 2", "isready"],
      "readyok"
    );
    this.ready = true;
  }

  public shutdown(): void {
    this.ready = false;
    this.worker.postMessage("quit");
    this.worker.terminate();
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

  public async evaluateGame(fens: string[], depth = 16): Promise<GameEval> {
    this.ready = false;
    console.log("Evaluating game");
    await this.sendCommands(["ucinewgame", "isready"], "readyok");
    this.worker.postMessage("position startpos");

    const moves: MoveEval[] = [];
    for (const fen of fens) {
      console.log(`Evaluating position: ${fen}`);
      const result = await this.evaluatePosition(fen, depth);
      moves.push(result);
    }

    this.ready = true;
    console.log("Game evaluated");
    return { moves };
  }

  public async evaluatePosition(fen: string, depth = 16): Promise<MoveEval> {
    const results = await this.sendCommands(
      [`position fen ${fen}`, `go depth ${depth}`],
      "bestmove"
    );
    return this.parseResults(results);
  }

  private parseResults(results: string[]): MoveEval {
    const parsedResults: MoveEval = {
      bestMove: "",
      lines: [],
    };

    for (const result of results) {
      if (result.startsWith("bestmove")) {
        const bestMove = this.getResultProperty(result, "bestmove");
        if (bestMove) {
          parsedResults.bestMove = bestMove;
        }
      }

      if (result.startsWith("info")) {
        const pv = this.getResultPv(result);
        const score = this.getResultProperty(result, "cp");
        const mate = this.getResultProperty(result, "mate");

        if (pv) {
          parsedResults.lines.push({
            pv,
            score: score ? parseInt(score) : undefined,
            mate: mate ? parseInt(mate) : undefined,
          });
        }
      }
    }

    return parsedResults;
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
