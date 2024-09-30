import { EngineName } from "@/types/enums";
import { UciEngine } from "./uciEngine";
import { isMultiThreadSupported, isWasmSupported } from "./shared";

export class Stockfish16_1 extends UciEngine {
  constructor(lite?: boolean) {
    if (!isWasmSupported()) {
      throw new Error("Stockfish 16.1 is not supported");
    }

    const multiThreadIsSupported = isMultiThreadSupported();
    if (!multiThreadIsSupported) console.log("Single thread mode");

    const enginePath = `engines/stockfish-16.1/stockfish-16.1${
      lite ? "-lite" : ""
    }${multiThreadIsSupported ? "" : "-single"}.js`;

    super(
      lite ? EngineName.Stockfish16_1Lite : EngineName.Stockfish16_1,
      enginePath
    );
  }
}
