import { useCallback } from "react";
import { Chess } from "chess.js";

interface Mistake {
  from: string;
  to: string;
  type: string;
}

interface UseMistakeHandlerParams {
  selectedVariation: { moves: string[] } | null;
  game: Chess;
  moveIdx: number;
  isUserTurn: boolean;
  setMoveIdx: (idx: number) => void;
  setLastMistakeVisible: (mistake: Mistake | null) => void;
  undoMove: () => void;
}

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
    for (let i = 0; i < moveIdx; i++) expectedMove.move(selectedVariation.moves[i]);
    const expected = expectedMove.move(selectedVariation.moves[moveIdx]);
    if (!expected || last.from !== expected.from || last.to !== expected.to) {
      let mistakeType = "Mistake";
      if (last.captured || last.san.includes("#")) mistakeType = "Blunder";
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
