import { useGameDatabase } from "@/hooks/useGameDatabase";
import { Grid, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import { gameAtom } from "../states";

interface Props {
  color: "white" | "black";
}

export default function PlayerInfo({ color }: Props) {
  const { gameFromUrl } = useGameDatabase();
  const game = useAtomValue(gameAtom);

  const playerName =
    gameFromUrl?.[color]?.name ||
    game.header()[color === "white" ? "White" : "Black"];

  return (
    <Grid item container xs={12} justifyContent="center" alignItems="center">
      <Typography variant="h5">
        {playerName || (color === "white" ? "White" : "Black")}
      </Typography>
    </Grid>
  );
}
