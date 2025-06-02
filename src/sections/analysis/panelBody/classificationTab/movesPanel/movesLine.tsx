import { MoveClassification } from "@/types/enums";
import { Box, Grid2 as Grid, Typography } from "@mui/material";
import MoveItem from "./moveItem";

interface Props {
  moves: { san: string; moveClassification?: MoveClassification }[];
  moveNb: number;
}

export default function MovesLine({ moves, moveNb }: Props) {
  return (
    <Grid
      container
      justifyContent="space-evenly"
      alignItems="center"
      wrap="nowrap"
      size={12}
    >
      <Typography width="2rem" fontSize="0.9rem">
        {moveNb}.
      </Typography>

      <MoveItem {...moves[0]} moveIdx={(moveNb - 1) * 2 + 1} moveColor="w" />

      {moves[1] ? (
        <MoveItem {...moves[1]} moveIdx={(moveNb - 1) * 2 + 2} moveColor="b" />
      ) : (
        <Box width="5rem" />
      )}
    </Grid>
  );
}
