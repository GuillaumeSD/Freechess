import { Icon } from "@iconify/react";
import { Grid, List, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import {
  boardAtom,
  engineMultiPvAtom,
  engineNameAtom,
  gameAtom,
} from "../states";
import LineEvaluation from "./lineEvaluation";
import { useCurrentPosition } from "../hooks/useCurrentPosition";
import { LineEval } from "@/types/eval";
import EngineSettingsButton from "@/sections/engineSettings/engineSettingsButton";
import Accuracies from "./accuracies";
import MoveInfo from "./moveInfo";
import Opening from "./opening";

export default function ReviewPanelBody() {
  const linesNumber = useAtomValue(engineMultiPvAtom);
  const engineName = useAtomValue(engineNameAtom);
  const position = useCurrentPosition(engineName);
  const game = useAtomValue(gameAtom);
  const board = useAtomValue(boardAtom);

  const boardHistory = board.history();
  const gameHistory = game.history();

  const isGameOver =
    boardHistory.length > 0 &&
    (board.isCheckmate() ||
      board.isDraw() ||
      boardHistory.join() === gameHistory.join());

  const linesSkeleton: LineEval[] = Array.from({ length: linesNumber }).map(
    (_, i) => ({ pv: [`${i}`], depth: 0, multiPv: i + 1 })
  );

  const engineLines = position?.eval?.lines?.length
    ? position.eval.lines
    : linesSkeleton;

  return (
    <Grid
      item
      container
      xs={12}
      justifyContent="center"
      alignItems="center"
      rowGap={1.2}
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
          <Typography variant="h6" align="center" lineHeight="25px">
            Engine evaluation
          </Typography>
        </Grid>

        <Grid item container xs={1} justifyContent="center">
          <EngineSettingsButton />
        </Grid>
      </Grid>

      <Accuracies />

      <MoveInfo />

      <Opening />

      {isGameOver && (
        <Grid item xs={12}>
          <Typography align="center" fontSize="0.9rem">
            Game is over
          </Typography>
        </Grid>
      )}

      <Grid item container xs={12} justifyContent="center" alignItems="center">
        <List sx={{ maxWidth: "95%", padding: 0 }}>
          {!board.isCheckmate() &&
            engineLines.map((line) => (
              <LineEvaluation key={line.multiPv} line={line} />
            ))}
        </List>
      </Grid>
    </Grid>
  );
}
