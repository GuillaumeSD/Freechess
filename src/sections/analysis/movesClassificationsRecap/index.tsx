import { usePlayersNames } from "@/hooks/usePlayerNames";
import { Grid, Typography } from "@mui/material";
import { gameAtom, gameEvalAtom } from "../states";
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
      borderRadius={2}
      border={1}
      borderColor={"secondary.main"}
      sx={{
        backgroundColor: "secondary.main",
        borderColor: "primary.main",
        borderWidth: 2,
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
      }}
      marginTop={{ xs: 0, lg: "2.5em" }}
      paddingY={3}
      rowGap={2}
      xs
      style={{ maxWidth: "50rem" }}
    >
      <Grid
        item
        container
        alignItems="center"
        justifyContent="space-evenly"
        wrap="nowrap"
        xs={12}
      >
        <Typography width="12rem" align="center">
          {whiteName}
        </Typography>

        <Typography width="7rem" />

        <Typography width="12rem" align="center">
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
