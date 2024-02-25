import { Grid, Typography } from "@mui/material";
import { useGameDatabase } from "@/hooks/useGameDatabase";
import { useAtomValue } from "jotai";
import { gameAtom } from "../../states";
import PlayerInfo from "./playerInfo";

export default function GamePanel() {
  const { gameFromUrl } = useGameDatabase();
  const game = useAtomValue(gameAtom);

  const hasGameInfo = gameFromUrl !== undefined || !!game.header().White;

  if (!hasGameInfo) {
    return (
      <Grid item container xs={12} justifyContent="center" alignItems="center">
        <Typography variant="h6">No game loaded</Typography>
      </Grid>
    );
  }

  return (
    <Grid
      item
      container
      xs={12}
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Grid item container xs={12} justifyContent="center" alignItems="center">
        <PlayerInfo color="white" />

        <Grid item container xs={1} justifyContent="center" alignItems="center">
          <Typography variant="h6">vs</Typography>
        </Grid>

        <PlayerInfo color="black" />
      </Grid>

      <Grid
        item
        container
        xs={10}
        justifyContent="space-evenly"
        alignItems="center"
        gap={2}
      >
        <Typography>
          Site : {gameFromUrl?.site || game.header().Site || "?"}
        </Typography>

        <Typography>
          Date : {gameFromUrl?.date || game.header().Date || "?"}
        </Typography>

        <Typography>
          Result :{" "}
          {gameFromUrl?.termination || game.header().Termination || "?"}
        </Typography>
      </Grid>
    </Grid>
  );
}
