export interface MoveEval {
  bestMove: string;
  lines: LineEval[];
}

export interface LineEval {
  pv: string[];
  cp?: number;
  mate?: number;
}

export interface GameEval {
  moves: MoveEval[];
  whiteAccuracy: number;
  blackAccuracy: number;
}
