import { LineEval } from "@/types/eval";
import { ListItem, Skeleton, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import { boardAtom } from "./states";
import { moveLineUciToSan } from "@/lib/chess";

interface Props {
  line: LineEval;
}

export default function LineEvaluation({ line }: Props) {
  const board = useAtomValue(boardAtom);
  const lineLabel =
    line.cp !== undefined
      ? `${line.cp / 100}`
      : line.mate
      ? `Mate in ${Math.abs(line.mate)}`
      : "?";

  const showSkeleton = line.depth === 0;

  return (
    <ListItem disablePadding>
      <Typography marginRight={2} marginY={0.5}>
        {showSkeleton ? (
          <Skeleton
            width={"2em"}
            variant="rounded"
            animation="wave"
            sx={{ color: "transparent" }}
          >
            placeholder
          </Skeleton>
        ) : (
          lineLabel
        )}
      </Typography>

      <Typography>
        {showSkeleton ? (
          <Skeleton width={"30em"} variant="rounded" animation="wave" />
        ) : (
          line.pv.slice(0, 10).map(moveLineUciToSan(board.fen())).join(", ")
        )}
      </Typography>
    </ListItem>
  );
}
