import { boardAtom, gameAtom, gameEvalAtom } from "@/sections/analysis/states";
import { MoveEval } from "@/types/eval";
import { Move } from "chess.js";
import { useAtomValue } from "jotai";
import { useMemo } from "react";

export type CurrentMove = Partial<Move> & {
  eval?: MoveEval;
  lastEval?: MoveEval;
};

export const useCurrentMove = () => {
  const gameEval = useAtomValue(gameEvalAtom);
  const game = useAtomValue(gameAtom);
  const board = useAtomValue(boardAtom);

  const currentMove: CurrentMove = useMemo(() => {
    const move = {
      ...board.history({ verbose: true }).at(-1),
    };

    if (!gameEval) return move;

    const boardHistory = board.history();
    const gameHistory = game.history();

    if (
      boardHistory.length <= gameHistory.length &&
      gameHistory.slice(0, boardHistory.length).join() === boardHistory.join()
    ) {
      const evalIndex = board.history().length;

      return {
        ...move,
        eval: gameEval.moves[evalIndex],
        lastEval: evalIndex > 0 ? gameEval.moves[evalIndex - 1] : undefined,
      };
    }

    return move;
  }, [gameEval, board, game]);

  return currentMove;
};
