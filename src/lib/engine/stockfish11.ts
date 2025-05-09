import { EngineName } from "@/types/enums";
import { UciEngine } from "./uciEngine";
import { getEngineWorkers } from "./worker";

export class Stockfish11 {
  public static async create(workersNb?: number): Promise<UciEngine> {
    const workers = getEngineWorkers("engines/stockfish-11.js", workersNb);

    return UciEngine.create(EngineName.Stockfish11, workers);
  }

  public static isSupported() {
    return true;
  }
}
