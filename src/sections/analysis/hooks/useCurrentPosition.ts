import {
  boardAtom,
  currentPositionAtom,
  engineDepthAtom,
  engineMultiPvAtom,
  gameAtom,
  gameEvalAtom,
  savedEvalsAtom,
} from "@/sections/analysis/states";
import { CurrentPosition, PositionEval } from "@/types/eval";
import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import { useEngine } from "../../../hooks/useEngine";
import { EngineName } from "@/types/enums";
import { getEvaluateGameParams } from "@/lib/chess";
import { getMovesClassification } from "@/lib/engine/helpers/moveClassification";

export const useCurrentPosition = (engineName?: EngineName) => {
  const [currentPosition, setCurrentPosition] = useAtom(currentPositionAtom);
  const engine = useEngine(engineName);
  const gameEval = useAtomValue(gameEvalAtom);
  const game = useAtomValue(gameAtom);
  const board = useAtomValue(boardAtom);
  const depth = useAtomValue(engineDepthAtom);
  const multiPv = useAtomValue(engineMultiPvAtom);
  const [savedEvals, setSavedEvals] = useAtom(savedEvalsAtom);

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

    setCurrentPosition(position);

    if (!position.eval && engine?.isReady() && engineName) {
      const getFenEngineEval = async (
        fen: string,
        setPartialEval?: (positionEval: PositionEval) => void
      ) => {
        if (!engine?.isReady() || !engineName)
          throw new Error("Engine not ready");
        const savedEval = savedEvals[fen];
        if (
          savedEval &&
          savedEval.engine === engineName &&
          savedEval.lines[0].depth >= depth
        ) {
          setPartialEval?.(savedEval);
          return savedEval;
        }

        const rawPositionEval = await engine.evaluatePositionWithUpdate({
          fen,
          depth,
          multiPv,
          setPartialEval,
        });

        setSavedEvals((prev) => ({
          ...prev,
          [fen]: { ...rawPositionEval, engine: engineName },
        }));

        return rawPositionEval;
      };

      const getPositionEval = async () => {
        const setPartialEval = (positionEval: PositionEval) => {
          setCurrentPosition({ ...position, eval: positionEval });
        };
        const rawPositionEval = await getFenEngineEval(
          board.fen(),
          setPartialEval
        );

        if (boardHistory.length === 0) return;

        const params = getEvaluateGameParams(board);
        const fens = params.fens.slice(board.turn() === "w" ? -3 : -4);
        const uciMoves = params.uciMoves.slice(board.turn() === "w" ? -2 : -3);

        const lastRawEval = await getFenEngineEval(fens.slice(-2)[0]);
        const rawPositions: PositionEval[] = fens.map((_, idx) => {
          if (idx === fens.length - 2) return lastRawEval;
          if (idx === fens.length - 1) return rawPositionEval;
          return {
            lines: [
              {
                pv: [],
                depth: 0,
                multiPv: 1,
                cp: 1,
              },
            ],
          };
        });

        const positionsWithMoveClassification = getMovesClassification(
          rawPositions,
          uciMoves,
          fens
        );

        setCurrentPosition({
          ...position,
          eval: positionsWithMoveClassification.slice(-1)[0],
          lastEval: positionsWithMoveClassification.slice(-2)[0],
        });
      };

      getPositionEval();
    }

    return () => {
      engine?.stopSearch();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameEval, board, game, engine, depth, multiPv]);

  return currentPosition;
};
