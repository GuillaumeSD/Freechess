import { Game } from "@/types/game";
import { Chess } from "chess.js";

export const pgnToFens = (pgn: string): string[] => {
  const game = new Chess();
  game.loadPgn(pgn);
  return game.history({ verbose: true }).map((move) => move.before);
};

export const getGameFromPgn = (pgn: string): Omit<Game, "id"> => {
  const game = new Chess();
  game.loadPgn(pgn);

  const headers: Record<string, string | undefined> = game.header();

  return {
    pgn,
    event: headers.Event,
    site: headers.Site,
    date: headers.Date,
    round: headers.Round,
    white: headers.White,
    black: headers.Black,
    result: headers.Result,
  };
};
