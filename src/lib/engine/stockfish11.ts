import { EngineName } from "@/types/enums";
import { UciEngine } from "./uciEngine";

export class Stockfish11 {
  public static async create(): Promise<UciEngine> {
    const enginePath = "engines/stockfish-11.js";

    return UciEngine.create(EngineName.Stockfish11, enginePath);
  }

  public static isSupported() {
    return true;
  }
}
