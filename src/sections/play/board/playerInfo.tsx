import { Grid, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import { engineSkillLevelAtom, playerColorAtom } from "../states";
import { Color } from "@/types/enums";

interface Props {
  color: Color;
}

export default function PlayerInfo({ color }: Props) {
  const playerColor = useAtomValue(playerColorAtom);
  const skillLevel = useAtomValue(engineSkillLevelAtom);

  const playerName =
    playerColor === color ? "You 🧠" : `Stockfish level ${skillLevel} 🤖`;

  return (
    <Grid item container xs={12} justifyContent="center" alignItems="center">
      <Typography variant="h6">{playerName}</Typography>
    </Grid>
  );
}
