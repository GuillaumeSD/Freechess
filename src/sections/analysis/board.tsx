import { Grid, Typography } from "@mui/material";
import { Chessboard } from "react-chessboard";
import { useAtomValue } from "jotai";
import { boardAtom } from "./states";

export default function Board() {
  const board = useAtomValue(boardAtom);

  return (
    <Grid
      item
      container
      rowGap={2}
      justifyContent="center"
      alignItems="center"
      xs={12}
      md={6}
    >
      <Typography variant="h4" align="center">
        White Player (?)
      </Typography>

      <Chessboard id="BasicBoard" position={board.fen()} />

      <Typography variant="h4" align="center">
        Black Player (?)
      </Typography>
    </Grid>
  );
}
