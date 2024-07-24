import { usePlayersNames } from "@/hooks/usePlayerNames";
import { Grid, Typography } from "@mui/material";
import { gameAtom, gameEvalAtom } from "../../../states";
import { MoveClassification } from "@/types/enums";
import ClassificationRow from "./classificationRow";
import { useAtomValue } from "jotai";

export default function MovesClassificationsRecap() {
  const { whiteName, blackName } = usePlayersNames(gameAtom);
  const gameEval = useAtomValue(gameEvalAtom);

  if (!gameEval?.positions.length) return null;

  return (
    <Grid
      container
      item
      justifyContent="center"
      alignItems="center"
      rowGap={1}
      xs={6}
      sx={{ scrollbarWidth: "thin", overflowY: "auto" }}
      maxHeight="100%"
    >
      <Grid
        item
        container
        alignItems="center"
        justifyContent="space-evenly"
        wrap="nowrap"
        xs={12}
      >
        <Typography width="12rem" align="center" noWrap fontSize="0.9rem">
          {whiteName}
        </Typography>

        <Typography width="7rem" />

        <Typography width="12rem" align="center" noWrap fontSize="0.9rem">
          {blackName}
        </Typography>
      </Grid>

      {sortedMoveClassfications.map((classification) => (
        <ClassificationRow
          key={classification}
          classification={classification}
        />
      ))}
    </Grid>
  );
}

export const sortedMoveClassfications = [
  MoveClassification.Brilliant,
  MoveClassification.Great,
  MoveClassification.Best,
  MoveClassification.Excellent,
  MoveClassification.Good,
  MoveClassification.Book,
  MoveClassification.Inaccuracy,
  MoveClassification.Mistake,
  MoveClassification.Blunder,
];
