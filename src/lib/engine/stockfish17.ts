import { EngineName } from "@/types/enums";
import { UciEngine } from "./uciEngine";
import { isMultiThreadSupported, isWasmSupported } from "./shared";
import { getEngineWorkers } from "./worker";

export class Stockfish17 {
  public static async create(lite?: boolean): Promise<UciEngine> {
    if (!Stockfish17.isSupported()) {
      throw new Error("Stockfish 17 is not supported");
    }

    const enginePath = lite
      ? "engines/stockfish-17/stockfish-17-lite-02843c1.js"
      : "engines/stockfish-17/stockfish-17-aaa11cd.js";
    const engineName = lite
      ? EngineName.Stockfish17Lite
      : EngineName.Stockfish17;

    const workers = getEngineWorkers(enginePath);

    return UciEngine.create(engineName, workers);
  }

  public static isSupported() {
    return isWasmSupported() && isMultiThreadSupported();
  }
}
