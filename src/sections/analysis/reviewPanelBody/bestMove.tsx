import { useCurrentMove } from "@/hooks/useCurrentMove";
import { Grid, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import { boardAtom } from "../states";
import { useMemo } from "react";
import { moveLineUciToSan } from "@/lib/chess";

export default function BestMove() {
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

  return (
    <Grid item xs={12}>
      <Typography align="center">{`${bestMoveSan} was the best move`}</Typography>
    </Grid>
  );
}
