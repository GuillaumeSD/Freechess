import { useCurrentMove } from "@/hooks/useCurrentMove";
import { Grid, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import { boardAtom } from "../states";
import { useMemo } from "react";
import { moveLineUciToSan } from "@/lib/chess";
import { MoveClassification } from "@/types/enums";

export default function MoveInfo() {
  const move = useCurrentMove();
  const board = useAtomValue(boardAtom);

  const bestMove = move?.lastEval?.bestMove;

  const bestMoveSan = useMemo(() => {
    if (!bestMove) return undefined;

    const lastPosition = board.history({ verbose: true }).at(-1)?.before;
    if (!lastPosition) return undefined;

    return moveLineUciToSan(lastPosition)(bestMove);
  }, [bestMove, board]);

  if (!bestMoveSan) return null;

  const moveClassification = move.eval?.moveClassification;
  const moveLabel = moveClassification
    ? `${move.san} is ${moveClassificationLabels[moveClassification]}`
    : null;

  const bestMoveLabel =
    moveClassification === MoveClassification.Best ||
    moveClassification === MoveClassification.Book
      ? null
      : `${bestMoveSan} was the best move`;

  return (
    <Grid item container columnGap={5} xs={12} justifyContent="center">
      {moveLabel && <Typography align="center">{moveLabel}</Typography>}
      {bestMoveLabel && <Typography align="center">{bestMoveLabel}</Typography>}
    </Grid>
  );
}

const moveClassificationLabels: Record<MoveClassification, string> = {
  [MoveClassification.Blunder]: "a blunder",
  [MoveClassification.Mistake]: "a mistake",
  [MoveClassification.Inaccuracy]: "an inaccuracy",
  [MoveClassification.Good]: "good",
  [MoveClassification.Excellent]: "excellent",
  [MoveClassification.Best]: "the best move",
  [MoveClassification.Book]: "an opening move",
};
