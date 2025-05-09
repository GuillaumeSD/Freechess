import { Grid2 as Grid, Typography } from "@mui/material";
import { useGameDatabase } from "@/hooks/useGameDatabase";
import { useAtomValue } from "jotai";
import { gameAtom } from "../states";

export default function GamePanel() {
  const { gameFromUrl } = useGameDatabase();
  const game = useAtomValue(gameAtom);
  const gameHeaders = game.getHeaders();

  const hasGameInfo =
    gameFromUrl !== undefined ||
    (!!gameHeaders.White && gameHeaders.White !== "?");

  if (!hasGameInfo) return null;

  const termination =
    gameFromUrl?.termination || gameHeaders.Termination || "?";
  const result =
    termination.split(" ").length > 2
      ? termination
      : gameFromUrl?.result || gameHeaders.Result || "?";

  return (
    <Grid
      container
      justifyContent="space-evenly"
      alignItems="center"
      rowGap={1}
      columnGap={3}
      size={11}
    >
      <Grid container justifyContent="center" alignItems="center" size="grow">
        <Typography noWrap fontSize="0.9rem">
          Site : {gameFromUrl?.site || gameHeaders.Site || "?"}
        </Typography>
      </Grid>

      <Grid container justifyContent="center" alignItems="center" size="grow">
        <Typography noWrap fontSize="0.9rem">
          Date : {gameFromUrl?.date || gameHeaders.Date || "?"}
        </Typography>
      </Grid>

      <Grid container justifyContent="center" alignItems="center" size="grow">
        <Typography noWrap fontSize="0.9rem">
          Result : {result}
        </Typography>
      </Grid>
    </Grid>
  );
}
