import {
  boardAtom,
  engineDepthAtom,
  engineMultiPvAtom,
  gameAtom,
  gameEvalAtom,
} from "@/sections/analysis/states";
import { MoveEval } from "@/types/eval";
import { Move } from "chess.js";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { useEngine } from "./useEngine";
import { EngineName } from "@/types/enums";

export type CurrentMove = Partial<Move> & {
  eval?: MoveEval;
  lastEval?: MoveEval;
};

export const useCurrentMove = () => {
  const [currentMove, setCurrentMove] = useState<CurrentMove>({});
  const engine = useEngine(EngineName.Stockfish16);
  const gameEval = useAtomValue(gameEvalAtom);
  const game = useAtomValue(gameAtom);
  const board = useAtomValue(boardAtom);
  const depth = useAtomValue(engineDepthAtom);
  const multiPv = useAtomValue(engineMultiPvAtom);

  useEffect(() => {
    const move: CurrentMove = {
      ...board.history({ verbose: true }).at(-1),
    };

    if (gameEval) {
      const boardHistory = board.history();
      const gameHistory = game.history();

      if (
        boardHistory.length <= gameHistory.length &&
        gameHistory.slice(0, boardHistory.length).join() === boardHistory.join()
      ) {
        const evalIndex = board.history().length;

        move.eval = gameEval.moves[evalIndex];
        move.lastEval =
          evalIndex > 0 ? gameEval.moves[evalIndex - 1] : undefined;
      }
    }

    if (!move.eval && engine?.isReady()) {
      const setPartialEval = (moveEval: MoveEval) => {
        setCurrentMove({ ...move, eval: moveEval });
      };

      engine.evaluatePositionWithUpdate({
        fen: board.fen(),
        depth,
        multiPv,
        setPartialEval,
      });
    }

    setCurrentMove(move);
  }, [gameEval, board, game, engine, depth, multiPv]);

  return currentMove;
};
