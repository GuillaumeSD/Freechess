import { Chess, Move } from "chess.js";
import { PrimitiveAtom, useAtom } from "jotai";
import { useCallback } from "react";

export const useChessActions = (chessAtom: PrimitiveAtom<Chess>) => {
  const [game, setGame] = useAtom(chessAtom);

  const setPgn = useCallback(
    (pgn: string) => {
      const newGame = new Chess();
      newGame.loadPgn(pgn);
      setGame(newGame);
    },
    [setGame]
  );

  const reset = useCallback(() => {
    setGame(new Chess());
  }, [setGame]);

  const copyGame = useCallback(() => {
    const newGame = new Chess();
    newGame.loadPgn(game.pgn());
    return newGame;
  }, [game]);

  const makeMove = useCallback(
    (move: { from: string; to: string; promotion?: string }): Move | null => {
      const newGame = copyGame();
      const result = newGame.move(move);
      setGame(newGame);

      return result;
    },
    [copyGame, setGame]
  );

  const undoMove = useCallback(() => {
    const newGame = copyGame();
    newGame.undo();
    setGame(newGame);
  }, [copyGame, setGame]);

  return { setPgn, reset, makeMove, undoMove };
};
