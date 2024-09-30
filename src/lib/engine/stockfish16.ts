import { EngineName } from "@/types/enums";
import { UciEngine } from "./uciEngine";
import { isMultiThreadSupported, isWasmSupported } from "./shared";

export class Stockfish16 extends UciEngine {
  constructor(nnue?: boolean) {
    if (!isWasmSupported()) {
      throw new Error("Stockfish 16 is not supported");
    }

    const multiThreadIsSupported = isMultiThreadSupported();
    if (!multiThreadIsSupported) console.log("Single thread mode");

    const enginePath = multiThreadIsSupported
      ? "engines/stockfish-16/stockfish-nnue-16.js"
      : "engines/stockfish-16/stockfish-nnue-16-single.js";

    const customEngineInit = async () => {
      await this.sendCommands(
        [`setoption name Use NNUE value ${!!nnue}`, "isready"],
        "readyok"
      );
    };

    super(EngineName.Stockfish16, enginePath, customEngineInit);
  }
}
