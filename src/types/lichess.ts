export interface LichessErrorBody {
  error: string | LichessError;
}

export interface LichessEvalBody {
  depth: number;
  pvs: {
    moves: string;
    cp?: number;
    mate?: number;
  }[];
}

export type LichessResponse<T> = T | LichessErrorBody;

export enum LichessError {
  NotFound = "Not found",
}

export interface LichessGame {
  id: string;
  speed: string;
  lastMoveAt: number;
  players: {
    white: LichessGameUser;
    black: LichessGameUser;
  };
  pgn: string;
}

export interface LichessGameUser {
  user?: { id: string; name: string };
  rating?: number;
}
