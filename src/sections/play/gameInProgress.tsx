import {
  Button,
  CircularProgress,
  Grid2 as Grid,
  Typography,
} from "@mui/material";
import { useAtom, useAtomValue } from "jotai";
import { gameAtom, isGameInProgressAtom } from "./states";
import { useEffect } from "react";
import UndoMoveButton from "./undoMoveButton";

export default function GameInProgress() {
  const game = useAtomValue(gameAtom);
  const [isGameInProgress, setIsGameInProgress] = useAtom(isGameInProgressAtom);

  useEffect(() => {
    if (game.isGameOver()) setIsGameInProgress(false);
  }, [game, setIsGameInProgress]);

  const handleResign = () => {
    setIsGameInProgress(false);
  };

  if (!isGameInProgress) return null;

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      gap={2}
      size={12}
    >
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        gap={2}
        size={12}
      >
        <Typography>Game in progress</Typography>
        <CircularProgress size={20} color="info" />
      </Grid>

      <Grid container justifyContent="center" alignItems="center" size={12}>
        <UndoMoveButton />
      </Grid>

      <Grid container justifyContent="center" alignItems="center" size={12}>
        <Button variant="outlined" onClick={handleResign}>
          Resign
        </Button>
      </Grid>
    </Grid>
  );
}
