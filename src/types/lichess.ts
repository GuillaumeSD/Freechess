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
  NotFound = "No cloud evaluation available for that position",
}

interface LichessPlayerData {
  user: {
    name: string;
    title?: string;
  };
  rating: number;
}

interface LichessClockData {
  initial: number;
  increment: number;
  totalTime: number;
}

interface LichessOpeningData {
  eco: string;
  name: string;
  ply: number;
}

export interface LichessRawGameData {
  id: string;
  createdAt: number;
  lastMoveAt: number;
  status: string;
  players: {
    white: LichessPlayerData;
    black: LichessPlayerData;
  };
  winner?: "white" | "black";
  opening?: LichessOpeningData;
  moves: string;
  pgn: string;
  clock: LichessClockData;
  url?: string;
}

export interface NormalizedLichessGameData {
  id: string;
  white: {
    username: string;
    rating: number;
    title?: string;
  };
  black: {
    username: string;
    rating: number;
    title?: string;
  };
  result: string;
  timeControl: string;
  date: string;
  opening?: string;
  moves: number;
  url: string;
}
