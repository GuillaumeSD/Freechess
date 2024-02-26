import { Icon } from "@iconify/react";
import { Grid, List, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import { boardAtom, engineMultiPvAtom, gameAtom } from "../states";
import LineEvaluation from "./lineEvaluation";
import { useCurrentMove } from "@/hooks/useCurrentMove";
import { LineEval } from "@/types/eval";
import { EngineName } from "@/types/enums";
import EngineSettingsButton from "@/sections/engineSettings/engineSettingsButton";

export default function ReviewPanelBody() {
  const linesNumber = useAtomValue(engineMultiPvAtom);
  const move = useCurrentMove(EngineName.Stockfish16);
  const game = useAtomValue(gameAtom);
  const board = useAtomValue(boardAtom);

  const boardHistory = board.history();
  const gameHistory = game.history();

  const bestMove = move?.lastEval?.bestMove;
  const isGameOver =
    gameHistory.length > 0 && boardHistory.join() === gameHistory.join();

  const linesSkeleton: LineEval[] = Array.from({ length: linesNumber }).map(
    (_, i) => ({ pv: [`${i}`], depth: 0, multiPv: i + 1 })
  );

  const engineLines = move?.eval?.lines?.length
    ? move.eval.lines
    : linesSkeleton;

  return (
    <Grid
      item
      container
      xs={12}
      justifyContent="center"
      alignItems="center"
      gap={1}
    >
      <Grid
        item
        container
        xs={12}
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item xs={1} />

        <Grid
          item
          container
          xs
          justifyContent="center"
          alignItems="center"
          columnGap={1}
        >
          <Icon
            icon="pepicons-pop:star-filled-circle"
            color="#27f019"
            height={25}
          />
          <Typography variant="h6" align="center">
            Engine evaluation
          </Typography>
        </Grid>

        <Grid item container xs={1} justifyContent="center">
          <EngineSettingsButton />
        </Grid>
      </Grid>

      {!!bestMove && (
        <Grid item xs={12}>
          <Typography align="center">
            {`${bestMove} was the best move`}
          </Typography>
        </Grid>
      )}

      {isGameOver && (
        <Grid item xs={12}>
          <Typography align="center">Game is over</Typography>
        </Grid>
      )}

      <Grid item container xs={12} justifyContent="center" alignItems="center">
        <List sx={{ maxWidth: "95%" }}>
          {engineLines.map((line) => (
            <LineEvaluation key={line.multiPv} line={line} />
          ))}
        </List>
      </Grid>
    </Grid>
  );
}
