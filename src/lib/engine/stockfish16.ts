import { EngineName } from "@/types/enums";
import { UciEngine } from "./uciEngine";

export class Stockfish16 extends UciEngine {
  constructor(nnue?: boolean) {
    if (!Stockfish16.isSupported()) {
      throw new Error("Stockfish 16 is not supported");
    }

    const isMultiThreadSupported = Stockfish16.isMultiThreadSupported();
    if (!isMultiThreadSupported) console.log("Single thread mode");

    const enginePath = isMultiThreadSupported
      ? "engines/stockfish-16-wasm/stockfish-nnue-16.js"
      : "engines/stockfish-16-wasm/stockfish-nnue-16-single.js";

    const customEngineInit = async () => {
      await this.sendCommands(
        [`setoption name Use NNUE value ${!!nnue}`, "isready"],
        "readyok"
      );
    };

    super(EngineName.Stockfish16, enginePath, customEngineInit);
  }

  public static isSupported() {
    return (
      typeof WebAssembly === "object" &&
      WebAssembly.validate(
        Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00)
      )
    );
  }

  public static isMultiThreadSupported() {
    return SharedArrayBuffer !== undefined;
  }
}
