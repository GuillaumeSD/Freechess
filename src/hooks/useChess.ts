import { Chess, Move } from "chess.js";
import { PrimitiveAtom, useAtom } from "jotai";

export const useChessActions = (chessAtom: PrimitiveAtom<Chess>) => {
  const [game, setGame] = useAtom(chessAtom);

  const setPgn = (pgn: string) => {
    const newGame = new Chess();
    newGame.loadPgn(pgn);
    setGame(newGame);
  };

  const reset = () => {
    setGame(new Chess());
  };

  const copyGame = () => {
    const newGame = new Chess();
    newGame.loadPgn(game.pgn());
    return newGame;
  };

  const move = (move: {
    from: string;
    to: string;
    promotion?: string;
  }): Move | null => {
    const newGame = copyGame();
    const result = newGame.move(move);
    setGame(newGame);

    return result;
  };

  const undo = () => {
    const newGame = copyGame();
    newGame.undo();
    setGame(newGame);
  };

  return { setPgn, reset, move, undo };
};
