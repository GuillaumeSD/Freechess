import { Color, MoveClassification } from "@/types/enums";
import { Grid2 as Grid, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import { boardAtom, gameAtom, gameEvalAtom } from "../../../states";
import { useMemo } from "react";
import Image from "next/image";
import { capitalize } from "@/lib/helpers";
import { useChessActions } from "@/hooks/useChessActions";
import { CLASSIFICATION_COLORS } from "@/constants";

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

  return (
    <Grid
      container
      justifyContent="space-evenly"
      alignItems="center"
      wrap="nowrap"
      color={CLASSIFICATION_COLORS[classification]}
      size={12}
    >
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        width={"3rem"}
        style={{ cursor: whiteNb ? "pointer" : "default" }}
        onClick={() => handleClick(Color.White)}
        fontSize="0.9rem"
      >
        {whiteNb}
      </Grid>

      <Grid
        container
        justifyContent="start"
        alignItems="center"
        width={"7rem"}
        gap={1}
        wrap="nowrap"
      >
        <Image
          src={`/icons/${classification}.png`}
          alt="move-icon"
          width={18}
          height={18}
          style={{
            maxWidth: "3.5vw",
            maxHeight: "3.5vw",
          }}
        />

        <Typography align="center" fontSize="0.9rem">
          {capitalize(classification)}
        </Typography>
      </Grid>

      <Grid
        container
        justifyContent="center"
        alignItems="center"
        width={"3rem"}
        style={{ cursor: blackNb ? "pointer" : "default" }}
        onClick={() => handleClick(Color.Black)}
        fontSize="0.9rem"
      >
        {blackNb}
      </Grid>
    </Grid>
  );
}
