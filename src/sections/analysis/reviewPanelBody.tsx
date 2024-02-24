import { Icon } from "@iconify/react";
import { Divider, Grid, List, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import { boardAtom, gameAtom } from "./states";
import LineEvaluation from "./lineEvaluation";
import { useCurrentMove } from "@/hooks/useCurrentMove";

export default function ReviewPanelBody() {
  const move = useCurrentMove();
  const game = useAtomValue(gameAtom);
  const board = useAtomValue(boardAtom);

  const boardHistory = board.history();
  const gameHistory = game.history();

  const bestMove = move?.lastEval?.bestMove;
  const isGameOver =
    gameHistory.length > 0 && boardHistory.join() === gameHistory.join();

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

      {!!bestMove && (
        <Grid item xs={12}>
          <Typography variant="h6" align="center">
            {`${bestMove} was the best move`}
          </Typography>
        </Grid>
      )}

      {isGameOver && (
        <Grid item xs={12}>
          <Typography variant="h6" align="center">
            Game is over
          </Typography>
        </Grid>
      )}

      <Grid item container xs={12} justifyContent="center" alignItems="center">
        <List>
          {move?.eval?.lines.map((line) => (
            <LineEvaluation key={line.pv[0]} line={line} />
          ))}
        </List>
      </Grid>
    </>
  );
}
