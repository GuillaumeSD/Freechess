import { EngineName } from "./enums";

export interface MoveEval {
  bestMove: string;
  lines: LineEval[];
}

export interface LineEval {
  pv: string[];
  cp?: number;
  mate?: number;
  depth: number;
  multiPv: number;
}

export interface Accuracy {
  white: number;
  black: number;
}

export interface EngineSettings {
  engine: EngineName;
  depth: number;
  multiPv: number;
  date: string;
}

export interface GameEval {
  moves: MoveEval[];
  accuracy: Accuracy;
  settings: EngineSettings;
}
