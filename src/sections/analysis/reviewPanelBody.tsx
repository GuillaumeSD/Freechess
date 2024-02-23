import { Icon } from "@iconify/react";
import { Divider, Grid, List, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import { boardAtom, gameAtom } from "./states";
import LineEvaluation from "./lineEvaluation";
import { useCurrentMove } from "@/hooks/useCurrentMove";

export default function ReviewPanelBody() {
  const game = useAtomValue(gameAtom);
  const board = useAtomValue(boardAtom);

  const move = useCurrentMove();

  const getBestMoveLabel = () => {
    const bestMove = move?.lastEval?.bestMove;
    if (bestMove) {
      return `${bestMove} was the best move`;
    }

    const boardHistory = board.history();
    const gameHistory = game.history();

    if (game.isGameOver() && boardHistory.join() === gameHistory.join()) {
      return "Game is over";
    }

    return null;
  };

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
        {getBestMoveLabel()}
      </Typography>

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
