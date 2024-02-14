interface MoveEval {
  bestMove: string;
  lines: LineEval[];
}

interface LineEval {
  pv: string[];
  score?: number;
  mate?: number;
}

interface GameEval {
  moves: MoveEval[];
}
