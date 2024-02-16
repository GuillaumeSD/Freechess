export interface MoveEval {
  bestMove: string;
  lines: LineEval[];
}

export interface LineEval {
  pv: string[];
  score?: number;
  mate?: number;
}

export interface GameEval {
  moves: MoveEval[];
}
