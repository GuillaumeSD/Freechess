import { Color } from "@/types/enums";
import { Player } from "@/types/game";
import { Avatar, Grid2 as Grid, Typography } from "@mui/material";
import CapturedPieces from "./capturedPieces";

export interface Props {
  player: Player;
  color: Color;
  fen: string;
}

export default function PlayerHeader({ color, player, fen }: Props) {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      columnGap={2}
      size={12}
    >
      {player.avatarUrl && (
        <Avatar
          src={player.avatarUrl}
          variant="circular"
          sx={{ width: 24, height: 24 }}
        />
      )}
      <Typography>
        {player.rating ? `${player.name} (${player.rating})` : player.name}
      </Typography>

      <CapturedPieces fen={fen} color={color} />
    </Grid>
  );
}
