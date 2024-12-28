import { EngineName } from "@/types/enums";
import { UciEngine } from "./uciEngine";
import { getEngineWorker } from "./worker";

export class Stockfish11 {
  public static async create(): Promise<UciEngine> {
    const worker = getEngineWorker("engines/stockfish-11.js");

    return UciEngine.create(EngineName.Stockfish11, worker);
  }
}
