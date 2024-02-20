import { Chess } from "chess.js";

export const pgnToFens = (pgn: string): string[] => {
  const game = new Chess();
  game.loadPgn(pgn);
  return game.history({ verbose: true }).map((move) => move.before);
};
