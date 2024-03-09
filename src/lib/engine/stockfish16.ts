import { EngineName } from "@/types/enums";
import { UciEngine } from "./uciEngine";

export class Stockfish16 extends UciEngine {
  constructor() {
    const isWasmSupported = Stockfish16.isWasmSupported();

    const enginePath = isWasmSupported
      ? "engines/stockfish-wasm/stockfish-nnue-16.js"
      : "engines/stockfish.js";

    super(EngineName.Stockfish16, enginePath);
  }

  public static isWasmSupported() {
    return (
      typeof WebAssembly === "object" &&
      WebAssembly.validate(
        Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00)
      )
    );
  }
}
