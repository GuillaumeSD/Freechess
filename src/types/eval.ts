export interface MoveEval {
  bestMove: string;
  lines: LineEval[];
}

export interface LineEval {
  pv: string[];
  cp?: number;
  mate?: number;
}

export interface Accuracy {
  white: number;
  black: number;
}

export interface GameEval {
  moves: MoveEval[];
  accuracy: Accuracy;
}
