import { useCallback } from "react";
import { Chess } from "chess.js";

/**
 * A mistake made by the user during opening training.
 */
export interface Mistake {
  from: string;
  to: string;
  type: string;
}

/**
 * Params for the useMistakeHandler hook.
 */
export interface UseMistakeHandlerParams {
  selectedVariation: { moves: string[] } | null;
  game: Chess;
  moveIdx: number;
  isUserTurn: boolean;
  setMoveIdx: (idx: number) => void;
  setLastMistakeVisible: (mistake: Mistake | null) => void;
  undoMove: () => void;
}

/**
 * Custom hook that checks if the user's move matches the expected move in the opening sequence,
 * and handles mistakes (visual feedback + undo).
 */
export function useMistakeHandler({
  selectedVariation,
  game,
  moveIdx,
  isUserTurn,
  setMoveIdx,
  setLastMistakeVisible,
  undoMove,
}: UseMistakeHandlerParams) {
  return useCallback(() => {
    if (!selectedVariation || !game) return;
    if (moveIdx >= selectedVariation.moves.length) return;
    if (!isUserTurn) return;
    const history = game.history({ verbose: true });
    if (history.length !== moveIdx + 1) return;
    const last = history[history.length - 1];
    const expectedMove = new Chess();
    for (let i = 0; i < moveIdx; i++) {
      expectedMove.move(selectedVariation.moves[i]);
    }
    const expected = expectedMove.move(selectedVariation.moves[moveIdx]);
    if (!expected || last.from !== expected.from || last.to !== expected.to) {
      const mistakeType = (last.captured || last.san.includes("#")) ? "Blunder" : "Mistake";
      setTimeout(() => {
        setLastMistakeVisible({ from: last.from, to: last.to, type: mistakeType });
        setTimeout(() => {
          undoMove();
          setLastMistakeVisible(null);
        }, 1300);
      }, 200);
    } else {
      setMoveIdx(moveIdx + 1);
    }
  }, [selectedVariation, game, moveIdx, isUserTurn, setMoveIdx, setLastMistakeVisible, undoMove]);
}

