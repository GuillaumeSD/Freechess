import { boardAtom, gameAtom, gameEvalAtom } from "@/sections/analysis/states";
import { useAtomValue } from "jotai";
import { useMemo } from "react";

export const useCurrentMove = () => {
  const gameEval = useAtomValue(gameEvalAtom);
  const game = useAtomValue(gameAtom);
  const board = useAtomValue(boardAtom);

  const currentEvalMove = useMemo(() => {
    if (!gameEval) return undefined;

    const boardHistory = board.history();
    const gameHistory = game.history();

    if (
      boardHistory.length >= gameHistory.length ||
      gameHistory.slice(0, boardHistory.length).join() !== boardHistory.join()
    )
      return;

    const evalIndex = board.history().length;
    return {
      ...board.history({ verbose: true }).at(-1),
      eval: gameEval.moves[evalIndex],
      lastEval: evalIndex > 0 ? gameEval.moves[evalIndex - 1] : undefined,
    };
  }, [gameEval, board, game]);

  return currentEvalMove;
};
