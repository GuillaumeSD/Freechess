import { EngineName } from "@/types/enums";
import { UciEngine } from "./uciEngine";
import { getEngineWorkers } from "./worker";

export class Stockfish11 {
  public static async create(): Promise<UciEngine> {
    const workers = getEngineWorkers("engines/stockfish-11.js");

    return UciEngine.create(EngineName.Stockfish11, workers);
  }

  public static isSupported() {
    return true;
  }
}
