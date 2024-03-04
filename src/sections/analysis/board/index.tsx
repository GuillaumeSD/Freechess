import { Grid } from "@mui/material";
import { Chessboard } from "react-chessboard";
import { useAtomValue } from "jotai";
import {
  boardAtom,
  boardOrientationAtom,
  currentMoveAtom,
  showBestMoveArrowAtom,
  showPlayerMoveArrowAtom,
} from "../states";
import { Arrow, Square } from "react-chessboard/dist/chessboard/types";
import { useChessActions } from "@/hooks/useChessActions";
import { useMemo, useRef } from "react";
import PlayerInfo from "./playerInfo";
import EvaluationBar from "./evaluationBar";
import { useScreenSize } from "@/hooks/useScreenSize";
import { MoveClassification } from "@/types/enums";

export default function Board() {
  const boardRef = useRef<HTMLDivElement>(null);
  const { boardSize } = useScreenSize();
  const board = useAtomValue(boardAtom);
  const boardOrientation = useAtomValue(boardOrientationAtom);
  const showBestMoveArrow = useAtomValue(showBestMoveArrowAtom);
  const showPlayerMoveArrow = useAtomValue(showPlayerMoveArrowAtom);
  const { makeMove: makeBoardMove } = useChessActions(boardAtom);
  const currentMove = useAtomValue(currentMoveAtom);

  const onPieceDrop = (
    source: Square,
    target: Square,
    piece: string
  ): boolean => {
    try {
      const result = makeBoardMove({
        from: source,
        to: target,
        promotion: piece[1]?.toLowerCase() ?? "q",
      });

      return !!result;
    } catch {
      return false;
    }
  };

  const customArrows: Arrow[] = useMemo(() => {
    const arrows: Arrow[] = [];
    const bestMove = currentMove?.lastEval?.bestMove;
    const moveClassification = currentMove?.eval?.moveClassification;

    if (
      bestMove &&
      showBestMoveArrow &&
      moveClassification !== MoveClassification.Book
    ) {
      const bestMoveArrow = [
        bestMove.slice(0, 2),
        bestMove.slice(2, 4),
        moveClassificationColors[MoveClassification.Best],
      ] as Arrow;

      arrows.push(bestMoveArrow);
    }

    if (
      currentMove.from &&
      currentMove.to &&
      showPlayerMoveArrow &&
      moveClassification !== MoveClassification.Best
    ) {
      const arrowColor = moveClassification
        ? moveClassificationColors[moveClassification]
        : "#ffaa00";
      const playerMoveArrow: Arrow = [
        currentMove.from,
        currentMove.to,
        arrowColor,
      ];

      if (
        arrows.every(
          (arrow) =>
            arrow[0] !== playerMoveArrow[0] || arrow[1] !== playerMoveArrow[1]
        )
      ) {
        arrows.push(playerMoveArrow);
      }
    }

    return arrows;
  }, [currentMove, showBestMoveArrow, showPlayerMoveArrow]);

  return (
    <Grid
      item
      container
      justifyContent="center"
      alignItems="center"
      wrap="nowrap"
      width={boardSize}
    >
      <EvaluationBar height={boardRef?.current?.offsetHeight || boardSize} />

      <Grid
        item
        container
        rowGap={1}
        justifyContent="center"
        alignItems="center"
        paddingLeft={2}
        xs
      >
        <PlayerInfo color={boardOrientation ? "black" : "white"} />

        <Grid
          item
          container
          justifyContent="center"
          alignItems="center"
          ref={boardRef}
          xs={12}
        >
          <Chessboard
            id="AnalysisBoard"
            position={board.fen()}
            onPieceDrop={onPieceDrop}
            boardOrientation={boardOrientation ? "white" : "black"}
            customArrows={customArrows}
            customBoardStyle={{
              borderRadius: "5px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
            }}
          />
        </Grid>

        <PlayerInfo color={boardOrientation ? "white" : "black"} />
      </Grid>
    </Grid>
  );
}

const moveClassificationColors: Record<MoveClassification, string> = {
  [MoveClassification.Best]: "#26c2a3",
  [MoveClassification.Book]: "#d5a47d",
  [MoveClassification.Excellent]: "#3aab18",
  [MoveClassification.Good]: "#81b64c",
  [MoveClassification.Inaccuracy]: "#f7c631",
  [MoveClassification.Mistake]: "#ffa459",
  [MoveClassification.Blunder]: "#fa412d",
};
