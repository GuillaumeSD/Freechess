interface ChessComPlayerData {
  username: string;
  rating: number;
  result?: string;
  title?: string;
}

interface ChessComOpeningData {
  name: string;
  eco?: string;
}

export interface ChessComRawGameData {
  uuid: string;
  id: string;
  url: string;
  pgn: string;
  white: ChessComPlayerData;
  black: ChessComPlayerData;
  result: string;
  time_control: string;
  end_time: number;
  opening?: ChessComOpeningData;
  eco?: string;
  termination?: string;
}

export interface NormalizedGameData {
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
