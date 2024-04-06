import { MoveClassification } from "@/types/enums";
import { Grid, Typography } from "@mui/material";
import MoveItem from "./moveItem";

interface Props {
  moves: { san: string; moveClassification?: MoveClassification }[];
  moveNb: number;
}

export default function MovesLine({ moves, moveNb }: Props) {
  return (
    <Grid
      container
      item
      justifyContent="space-evenly"
      alignItems="center"
      xs={12}
      wrap="nowrap"
    >
      <Typography width="2rem" fontSize="0.9rem">
        {moveNb}.
      </Typography>

      <MoveItem {...moves[0]} moveIdx={(moveNb - 1) * 2 + 1} />

      <MoveItem {...moves[1]} moveIdx={(moveNb - 1) * 2 + 2} />
    </Grid>
  );
}
