import { Color } from "@/types/enums";
import { Player } from "@/types/game";
import { Avatar, Grid2 as Grid, Typography } from "@mui/material";
import CapturedPieces from "./capturedPieces";
import { PrimitiveAtom, useAtomValue } from "jotai";
import { Chess } from "chess.js";
import { useMemo } from "react";

export interface Props {
  player: Player;
  color: Color;
  gameAtom: PrimitiveAtom<Chess>;
}

export default function PlayerHeader({ color, player, gameAtom }: Props) {
  const game = useAtomValue(gameAtom);

  const clock = useMemo(() => {
    const comment = game.getComment();
    if (!comment) return undefined;

    const match = comment.match(/\[%clk (\d+):(\d+):(\d+)(?:\.(\d*))?\]/);
    if (!match) return undefined;

    return {
      hours: parseInt(match[1]),
      minutes: parseInt(match[2]),
      seconds: parseInt(match[3]),
      tenths: match[4] ? parseInt(match[4]) : 0,
    };
  }, [game]);
  console.log(clock);

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

      <CapturedPieces fen={game.fen()} color={color} />
    </Grid>
  );
}
