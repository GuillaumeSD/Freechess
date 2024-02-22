import { Icon } from "@iconify/react";
import { Divider, Grid, List, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import { boardAtom, gameEvalAtom } from "./states";
import LineEvaluation from "./lineEvaluation";

export default function ReviewPanelBody() {
  const gameEval = useAtomValue(gameEvalAtom);
  if (!gameEval) return null;

  const board = useAtomValue(boardAtom);
  const evalIndex = board.history().length;
  const moveEval = gameEval.moves[evalIndex];

  return (
    <>
      <Divider sx={{ width: "90%", marginY: 3 }} />

      <Grid
        item
        container
        xs={12}
        justifyContent="center"
        alignItems="center"
        columnGap={1}
      >
        <Icon
          icon="pepicons-pop:star-filled-circle"
          color="#27f019"
          height={30}
        />
        <Typography variant="h5" align="center">
          Game Review
        </Typography>
      </Grid>

      <Typography variant="h6" align="center">
        {moveEval ? `${moveEval.bestMove} is the best move` : "Game is over"}
      </Typography>

      <Grid item container xs={12} justifyContent="center" alignItems="center">
        <List>
          {moveEval?.lines.map((line) => (
            <LineEvaluation key={line.pv[0]} line={line} />
          ))}
        </List>
      </Grid>
    </>
  );
}
