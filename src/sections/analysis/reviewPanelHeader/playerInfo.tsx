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

  const rating =
    gameFromUrl?.[color]?.rating ||
    game.header()[color === "white" ? "WhiteElo" : "BlackElo"];

  const playerName =
    gameFromUrl?.[color]?.name ||
    game.header()[color === "white" ? "White" : "Black"];

  return (
    <Grid
      item
      container
      xs={5}
      justifyContent={color === "white" ? "flex-end" : "flex-start"}
      alignItems="center"
      gap={1}
    >
      <Typography variant="h6">
        {playerName || (color === "white" ? "White" : "Black")}
      </Typography>

      <Typography variant="h6">{rating ? `(${rating})` : "(?)"}</Typography>
    </Grid>
  );
}
