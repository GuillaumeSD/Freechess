import {
  Grid2 as Grid,
  Grid2Props as GridProps,
  List,
  Typography,
} from "@mui/material";
import { useAtomValue } from "jotai";
import {
  boardAtom,
  engineMultiPvAtom,
  engineNameAtom,
  gameAtom,
} from "../../states";
import LineEvaluation from "./lineEvaluation";
import { useCurrentPosition } from "../../hooks/useCurrentPosition";
import { LineEval } from "@/types/eval";
import Accuracies from "./accuracies";
import MoveInfo from "./moveInfo";
import Opening from "./opening";

export default function AnalysisTab(props: GridProps) {
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
      container
      size={12}
      justifyContent="center"
      alignItems="start"
      height="100%"
      rowGap={1.2}
      {...props}
      sx={
        props.hidden
          ? { display: "none" }
          : { overflow: "hidden", overflowY: "auto", ...props.sx }
      }
    >
      <Accuracies params={"accurecy"} />
      <Accuracies params={"rating"} />

      <MoveInfo />

      <Opening />

      {isGameOver && (
        <Grid size={12}>
          <Typography align="center" fontSize="0.9rem">
            Game is over
          </Typography>
        </Grid>
      )}

      <Grid container justifyContent="center" alignItems="center" size={12}>
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
