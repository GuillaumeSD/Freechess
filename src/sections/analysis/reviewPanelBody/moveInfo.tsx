import { Grid, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import { boardAtom, currentPositionAtom } from "../states";
import { useMemo } from "react";
import { moveLineUciToSan } from "@/lib/chess";
import { MoveClassification } from "@/types/enums";

export default function MoveInfo() {
  const position = useAtomValue(currentPositionAtom);
  const board = useAtomValue(boardAtom);

  const bestMove = position?.lastEval?.bestMove;

  const bestMoveSan = useMemo(() => {
    if (!bestMove) return undefined;

    const lastPosition = board.history({ verbose: true }).at(-1)?.before;
    if (!lastPosition) return undefined;

    return moveLineUciToSan(lastPosition)(bestMove);
  }, [bestMove, board]);

  if (!bestMoveSan) return null;

  const moveClassification = position.eval?.moveClassification;
  const moveLabel = moveClassification
    ? `${position.lastMove?.san} is ${moveClassificationLabels[moveClassification]}`
    : null;

  const bestMoveLabel =
    moveClassification === MoveClassification.Best ||
    moveClassification === MoveClassification.Book ||
    moveClassification === MoveClassification.Brilliant ||
    moveClassification === MoveClassification.Great
      ? null
      : `${bestMoveSan} was the best move`;

  return (
    <Grid item container columnGap={5} xs={12} justifyContent="center">
      {moveLabel && (
        <Typography align="center" fontSize="0.9rem">
          {moveLabel}
        </Typography>
      )}
      {bestMoveLabel && (
        <Typography align="center" fontSize="0.9rem">
          {bestMoveLabel}
        </Typography>
      )}
    </Grid>
  );
}

const moveClassificationLabels: Record<MoveClassification, string> = {
  [MoveClassification.Book]: "a book move",
  [MoveClassification.Brilliant]: "brilliant !!",
  [MoveClassification.Great]: "a great move !",
  [MoveClassification.Best]: "the best move",
  [MoveClassification.Excellent]: "excellent",
  [MoveClassification.Good]: "good",
  [MoveClassification.Inaccuracy]: "an inaccuracy",
  [MoveClassification.Mistake]: "a mistake",
  [MoveClassification.Blunder]: "a blunder",
};
