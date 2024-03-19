import { Button, CircularProgress, Grid, Typography } from "@mui/material";
import { useAtom, useAtomValue } from "jotai";
import { gameAtom, isGameInProgressAtom } from "./states";
import { useEffect } from "react";

export default function GameInProgress() {
  const game = useAtomValue(gameAtom);
  const [isGameInProgress, setIsGameInProgress] = useAtom(isGameInProgressAtom);

  useEffect(() => {
    if (game.isGameOver()) setIsGameInProgress(false);
  }, [game, setIsGameInProgress]);

  if (!isGameInProgress) return null;

  return (
    <Grid
      item
      container
      xs={12}
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Grid
        container
        item
        justifyContent="center"
        alignItems="center"
        xs={12}
        gap={2}
      >
        <Typography>Game in progress</Typography>
        <CircularProgress size={20} color="info" />
      </Grid>

      <Grid
        item
        container
        justifyContent="center"
        alignItems="center"
        xs={12}
        gap={2}
      >
        <Button variant="outlined" onClick={() => setIsGameInProgress(false)}>
          Resign
        </Button>
      </Grid>
    </Grid>
  );
}
