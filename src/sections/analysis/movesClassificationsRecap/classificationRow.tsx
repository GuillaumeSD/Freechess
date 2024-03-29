import { Color, MoveClassification } from "@/types/enums";
import { Grid, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import { boardAtom, gameAtom, gameEvalAtom } from "../states";
import { useMemo } from "react";
import { moveClassificationColors } from "@/components/board/squareRenderer";
import Image from "next/image";
import { capitalize } from "@/lib/helpers";
import { useChessActions } from "@/hooks/useChessActions";

interface Props {
  classification: MoveClassification;
}

export default function ClassificationRow({ classification }: Props) {
  const gameEval = useAtomValue(gameEvalAtom);
  const board = useAtomValue(boardAtom);
  const game = useAtomValue(gameAtom);
  const { goToMove } = useChessActions(boardAtom);

  const whiteNb = useMemo(() => {
    if (!gameEval) return 0;
    return gameEval.positions.filter(
      (position, idx) =>
        idx % 2 !== 0 && position.moveClassification === classification
    ).length;
  }, [gameEval, classification]);

  const blackNb = useMemo(() => {
    if (!gameEval) return 0;
    return gameEval.positions.filter(
      (position, idx) =>
        idx % 2 === 0 && position.moveClassification === classification
    ).length;
  }, [gameEval, classification]);

  const handleClick = (color: Color) => {
    if (
      !gameEval ||
      (color === Color.White && !whiteNb) ||
      (color === Color.Black && !blackNb)
    ) {
      return;
    }

    const filterColor = (idx: number) =>
      (idx % 2 !== 0 && color === Color.White) ||
      (idx % 2 === 0 && color === Color.Black);
    const moveIdx = board.history().length;

    const nextPositionIdx = gameEval.positions.findIndex(
      (position, idx) =>
        filterColor(idx) &&
        position.moveClassification === classification &&
        idx > moveIdx
    );

    if (nextPositionIdx > 0) {
      goToMove(nextPositionIdx, game);
    } else {
      const firstPositionIdx = gameEval.positions.findIndex(
        (position, idx) =>
          filterColor(idx) && position.moveClassification === classification
      );
      if (firstPositionIdx > 0 && firstPositionIdx !== moveIdx) {
        goToMove(firstPositionIdx, game);
      }
    }
  };

  if (!gameEval?.positions.length) return null;

  return (
    <Grid
      container
      item
      justifyContent="space-evenly"
      alignItems="center"
      xs={12}
      wrap="nowrap"
      color={moveClassificationColors[classification]}
    >
      <Grid
        container
        item
        justifyContent="center"
        alignItems="center"
        width={"3rem"}
        style={{ cursor: whiteNb ? "pointer" : "default" }}
        onClick={() => handleClick(Color.White)}
      >
        {whiteNb}
      </Grid>

      <Grid
        container
        item
        justifyContent="start"
        alignItems="center"
        width={"7rem"}
        gap={1}
      >
        <Image
          src={`/icons/${classification}.png`}
          alt="move-icon"
          width={20}
          height={20}
          style={{
            maxWidth: "3.6vw",
            maxHeight: "3.6vw",
          }}
        />

        <Typography align="center">{capitalize(classification)}</Typography>
      </Grid>

      <Grid
        container
        item
        justifyContent="center"
        alignItems="center"
        width={"3rem"}
        style={{ cursor: blackNb ? "pointer" : "default" }}
        onClick={() => handleClick(Color.Black)}
      >
        {blackNb}
      </Grid>
    </Grid>
  );
}
