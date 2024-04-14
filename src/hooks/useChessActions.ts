import { setGameHeaders } from "@/lib/chess";
import {
  playGameEndSound,
  playIllegalMoveSound,
  playSoundFromMove,
} from "@/lib/sounds";
import { Chess, Move } from "chess.js";
import { PrimitiveAtom, useAtom } from "jotai";
import { useCallback } from "react";

export interface resetGameParams {
  fen?: string;
  whiteName?: string;
  blackName?: string;
}

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

  const reset = useCallback(
    (params?: resetGameParams) => {
      const newGame = new Chess(params?.fen);
      setGameHeaders(newGame, params);
      setGame(newGame);
    },
    [setGame]
  );

  const copyGame = useCallback(() => {
    const newGame = new Chess();
    newGame.loadPgn(game.pgn());
    return newGame;
  }, [game]);

  const makeMove = useCallback(
    (move: { from: string; to: string; promotion?: string }): Move | null => {
      const newGame = copyGame();
      try {
        const result = newGame.move(move);
        setGame(newGame);
        playSoundFromMove(result);
        return result;
      } catch {
        playIllegalMoveSound();
        return null;
      }
    },
    [copyGame, setGame]
  );

  const undoMove = useCallback(() => {
    const newGame = copyGame();
    const move = newGame.undo();
    if (move) playSoundFromMove(move);
    setGame(newGame);
  }, [copyGame, setGame]);

  const goToMove = useCallback(
    (moveIdx: number, fullGame: Chess) => {
      if (moveIdx < 0) return;

      const newGame = new Chess();
      newGame.loadPgn(fullGame.pgn());

      const movesNb = fullGame.history().length;
      if (moveIdx > movesNb) return;

      let lastMove: Move | null = null;
      for (let i = movesNb; i > moveIdx; i--) {
        lastMove = newGame.undo();
      }

      setGame(newGame);
      if (lastMove) {
        playSoundFromMove(lastMove);
      } else {
        playGameEndSound();
      }
    },
    [setGame]
  );

  return { setPgn, reset, makeMove, undoMove, goToMove };
};
