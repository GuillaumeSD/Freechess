export interface ChessComGame {
  uuid: string;
  white: ChessComUser;
  black: ChessComUser;
  end_time: number;
  pgn: string;
  time_class: string;
}

export interface ChessComUser {
  username: string;
  rating: number;
  ["@id"]: string;
}
