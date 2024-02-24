import { Grid } from "@mui/material";
import { Chessboard } from "react-chessboard";
import { useAtomValue } from "jotai";
import {
  boardAtom,
  boardOrientationAtom,
  showBestMoveArrowAtom,
  showPlayerMoveArrowAtom,
} from "../states";
import { Arrow, Square } from "react-chessboard/dist/chessboard/types";
import { useChessActions } from "@/hooks/useChess";
import { useCurrentMove } from "@/hooks/useCurrentMove";
import { useMemo, useRef } from "react";
import PlayerInfo from "./playerInfo";
import EvaluationBar from "./evaluationBar";

export default function Board() {
  const boardRef = useRef<HTMLDivElement>(null);
  const board = useAtomValue(boardAtom);
  const boardOrientation = useAtomValue(boardOrientationAtom);
  const showBestMoveArrow = useAtomValue(showBestMoveArrowAtom);
  const showPlayerMoveArrow = useAtomValue(showPlayerMoveArrowAtom);
  const boardActions = useChessActions(boardAtom);
  const currentMove = useCurrentMove();

  const onPieceDrop = (source: Square, target: Square): boolean => {
    try {
      const result = boardActions.move({
        from: source,
        to: target,
        promotion: "q", // TODO: Let the user choose the promotion
      });

      return !!result;
    } catch {
      return false;
    }
  };

  const customArrows: Arrow[] = useMemo(() => {
    const arrows: Arrow[] = [];

    if (currentMove?.lastEval && showBestMoveArrow) {
      const bestMoveArrow = [
        currentMove.lastEval.bestMove.slice(0, 2),
        currentMove.lastEval.bestMove.slice(2, 4),
        "#3aab18",
      ] as Arrow;

      arrows.push(bestMoveArrow);
    }

    if (currentMove.from && currentMove.to && showPlayerMoveArrow) {
      const playerMoveArrow: Arrow = [
        currentMove.from,
        currentMove.to,
        "#ffaa00",
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
    <Grid item container justifyContent="center" alignItems="center" xs={12}>
      <EvaluationBar height={boardRef?.current?.offsetWidth} />

      <Grid
        item
        container
        rowGap={2}
        justifyContent="center"
        alignItems="center"
        xs={11}
      >
        <PlayerInfo color={boardOrientation ? "black" : "white"} />

        <Grid
          item
          container
          justifyContent="center"
          alignItems="center"
          ref={boardRef}
        >
          <Chessboard
            id="AnalysisBoard"
            position={board.fen()}
            onPieceDrop={onPieceDrop}
            boardOrientation={boardOrientation ? "white" : "black"}
            customArrows={customArrows}
            customBoardStyle={{ borderRadius: "5px" }}
          />
        </Grid>

        <PlayerInfo color={boardOrientation ? "white" : "black"} />
      </Grid>
    </Grid>
  );
}
