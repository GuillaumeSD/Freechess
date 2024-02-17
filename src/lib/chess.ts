import { Chess } from "chess.js";

export const initPgn = new Chess().pgn();

export const getGameFens = (pgn: string): string[] => {
  const game = new Chess();
  game.loadPgn(pgn);
  return game.history({ verbose: true }).map((move) => move.before);
};

export const getLastFen = (pgn: string): string => {
  const game = new Chess();
  game.loadPgn(pgn);
  return game.fen();
};

export const undoLastMove = (pgn: string): string => {
  if (pgn === initPgn) return pgn;
  const game = new Chess();
  game.loadPgn(pgn);
  game.undo();
  return game.pgn();
};

export const addMove = (
  pgn: string,
  move: {
    from: string;
    to: string;
    promotion?: string;
  }
): string => {
  const game = new Chess();
  game.loadPgn(pgn);
  game.move(move);
  return game.pgn();
};

export const addNextMove = (boardPgn: string, gamePgn: string): string => {
  const board = new Chess();
  board.loadPgn(boardPgn);

  const game = new Chess();
  game.loadPgn(gamePgn);

  const nextMoveIndex = board.history().length;
  const nextMove = game.history({ verbose: true })[nextMoveIndex];

  if (nextMove) {
    board.move({
      from: nextMove.from,
      to: nextMove.to,
      promotion: nextMove.promotion,
    });
  }

  return board.pgn();
};

export const getNextMoveIndex = (pgn: string): number => {
  const game = new Chess();
  game.loadPgn(pgn);
  return game.history().length;
};
