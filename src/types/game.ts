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

export interface Game {
  id: number;
  pgn: string;
  event?: string;
  site?: string;
  date?: string;
  round?: string;
  white?: string;
  black?: string;
  result?: string;
  eval?: GameEval;
}
