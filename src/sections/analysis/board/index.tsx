import { useAtomValue } from "jotai";
import {
  boardAtom,
  boardOrientationAtom,
  currentPositionAtom,
  gameAtom,
  showBestMoveArrowAtom,
  showPlayerMoveIconAtom,
} from "../states";
import { useMemo } from "react";
import { useScreenSize } from "@/hooks/useScreenSize";
import { Color } from "@/types/enums";
import Board from "@/components/board";
import { usePlayersNames } from "@/hooks/usePlayerNames";

export default function BoardContainer() {
  const screenSize = useScreenSize();
  const boardOrientation = useAtomValue(boardOrientationAtom);
  const showBestMoveArrow = useAtomValue(showBestMoveArrowAtom);
  const { whiteName, whiteElo, blackName, blackElo } =
    usePlayersNames(gameAtom);

  const boardSize = useMemo(() => {
    const width = screenSize.width;
    const height = screenSize.height;

    // 1200 is the lg layout breakpoint
    if (window?.innerWidth < 1200) {
      return Math.min(width, height - 150);
    }

    return Math.min(width - 700, height * 0.95);
  }, [screenSize]);

  return (
    <Board
      id="AnalysisBoard"
      boardSize={boardSize}
      canPlay={true}
      gameAtom={boardAtom}
      whitePlayer={whiteElo ? `${whiteName} (${whiteElo})` : whiteName}
      blackPlayer={blackElo ? `${blackName} (${blackElo})` : blackName}
      boardOrientation={boardOrientation ? Color.White : Color.Black}
      currentPositionAtom={currentPositionAtom}
      showBestMoveArrow={showBestMoveArrow}
      showPlayerMoveIconAtom={showPlayerMoveIconAtom}
      showEvaluationBar={true}
    />
  );
}
