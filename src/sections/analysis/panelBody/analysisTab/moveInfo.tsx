import { Grid2 as Grid, Skeleton, Stack, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import { boardAtom, currentPositionAtom } from "../../states";
import { useMemo } from "react";
import { moveLineUciToSan } from "@/lib/chess";
import { MoveClassification } from "@/types/enums";
import Image from "next/image";

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

  if (board.history().length === 0) return null;

  if (!bestMoveSan) {
    return (
      <Grid
        size={12}
        justifyItems="center"
        alignContent="center"
        marginTop={0.5}
      >
        <Skeleton
          variant="rounded"
          animation="wave"
          width={"12em"}
          sx={{ color: "transparent", maxWidth: "7vw", maxHeight: "3.5vw" }}
        >
          <Typography align="center" fontSize="0.9rem">
            placeholder
          </Typography>
        </Skeleton>
      </Grid>
    );
  }

  const moveClassification = position.eval?.moveClassification;
  const moveLabel = moveClassification
    ? `${position.lastMove?.san} is ${moveClassificationLabels[moveClassification]}`
    : null;

  const bestMoveLabel =
    moveClassification === MoveClassification.Best ||
    moveClassification === MoveClassification.Book ||
    moveClassification === MoveClassification.Forced ||
    moveClassification === MoveClassification.Brilliant ||
    moveClassification === MoveClassification.Great
      ? null
      : `${bestMoveSan} was the best move`;

  return (
    <Grid
      container
      columnGap={5}
      justifyContent="center"
      size={12}
      marginTop={0.5}
    >
      {moveLabel && (
        <Stack direction="row" alignItems="center" spacing={1}>
          {moveClassification && (
            <Image
              src={`/icons/${moveClassification}.png`}
              alt="move-icon"
              width={16}
              height={16}
              style={{
                maxWidth: "3.5vw",
                maxHeight: "3.5vw",
              }}
            />
          )}
          <Typography align="center" fontSize="0.9rem">
            {moveLabel}
          </Typography>
        </Stack>
      )}
      {bestMoveLabel && (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Image
            src={"/icons/best.png"}
            alt="move-icon"
            width={16}
            height={16}
            style={{
              maxWidth: "3.5vw",
              maxHeight: "3.5vw",
            }}
          />
          <Typography align="center" fontSize="0.9rem">
            {bestMoveLabel}
          </Typography>
        </Stack>
      )}
    </Grid>
  );
}

const moveClassificationLabels: Record<MoveClassification, string> = {
  [MoveClassification.Book]: "a book move",
  [MoveClassification.Forced]: "forced",
  [MoveClassification.Brilliant]: "brilliant !!",
  [MoveClassification.Great]: "a great move !",
  [MoveClassification.Best]: "the best move",
  [MoveClassification.Excellent]: "excellent",
  [MoveClassification.Good]: "good",
  [MoveClassification.Inaccuracy]: "an inaccuracy",
  [MoveClassification.Mistake]: "a mistake",
  [MoveClassification.Blunder]: "a blunder",
};
