import { Grid2 as Grid, Grid2Props as GridProps, List } from "@mui/material";
import LineEvaluation from "./lineEvaluation";
import {
  boardAtom,
  currentPositionAtom,
  engineMultiPvAtom,
} from "../../../states";
import { useAtomValue } from "jotai";
import { LineEval } from "@/types/eval";

export default function EngineLines(props: GridProps) {
  const board = useAtomValue(boardAtom);
  const linesNumber = useAtomValue(engineMultiPvAtom);
  const position = useAtomValue(currentPositionAtom);

  const linesSkeleton: LineEval[] = Array.from({ length: linesNumber }).map(
    (_, i) => ({ pv: [`${i}`], depth: 0, multiPv: i + 1 })
  );

  const engineLines = position?.eval?.lines?.length
    ? position.eval.lines
    : linesSkeleton;

  if (board.isCheckmate()) return null;

  return (
    <Grid container justifyContent="center" alignItems="center" {...props}>
      <List sx={{ width: "95%", padding: 0 }}>
        {engineLines.map((line) => (
          <LineEvaluation key={line.multiPv} line={line} />
        ))}
      </List>
    </Grid>
  );
}
