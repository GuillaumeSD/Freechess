import {
  boardAtom,
  currentPositionAtom,
  engineDepthAtom,
  engineMultiPvAtom,
  gameAtom,
  gameEvalAtom,
} from "@/sections/analysis/states";
import { CurrentPosition, PositionEval } from "@/types/eval";
import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import { useEngine } from "../../../hooks/useEngine";
import { EngineName } from "@/types/enums";

export const useCurrentPosition = (engineName?: EngineName) => {
  const [currentPosition, setCurrentPosition] = useAtom(currentPositionAtom);
  const engine = useEngine(engineName);
  const gameEval = useAtomValue(gameEvalAtom);
  const game = useAtomValue(gameAtom);
  const board = useAtomValue(boardAtom);
  const depth = useAtomValue(engineDepthAtom);
  const multiPv = useAtomValue(engineMultiPvAtom);

  useEffect(() => {
    const position: CurrentPosition = {
      lastMove: board.history({ verbose: true }).at(-1),
    };

    const boardHistory = board.history();
    const gameHistory = game.history();

    if (
      boardHistory.length <= gameHistory.length &&
      gameHistory.slice(0, boardHistory.length).join() === boardHistory.join()
    ) {
      position.currentMoveIdx = boardHistory.length;

      if (gameEval) {
        const evalIndex = boardHistory.length;

        position.eval = gameEval.positions[evalIndex];
        position.lastEval =
          evalIndex > 0 ? gameEval.positions[evalIndex - 1] : undefined;
      }
    }

    if (!position.eval && engine?.isReady()) {
      const setPartialEval = (positionEval: PositionEval) => {
        setCurrentPosition({ ...position, eval: positionEval });
      };

      engine.evaluatePositionWithUpdate({
        fen: board.fen(),
        depth,
        multiPv,
        setPartialEval,
      });
    }

    setCurrentPosition(position);
  }, [gameEval, board, game, engine, depth, multiPv, setCurrentPosition]);

  return currentPosition;
};
