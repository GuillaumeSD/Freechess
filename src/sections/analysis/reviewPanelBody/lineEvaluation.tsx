import { LineEval } from "@/types/eval";
import { ListItem, Skeleton, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import { boardAtom } from "../states";
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
      ? `${line.mate > 0 ? "" : "-"}M${Math.abs(line.mate)}`
      : "?";

  const showSkeleton = line.depth < 6;

  return (
    <ListItem disablePadding>
      <Typography
        marginRight={1.5}
        marginY={0.5}
        noWrap
        overflow="visible"
        width="3em"
        textAlign="center"
        fontSize="0.9rem"
      >
        {showSkeleton ? (
          <Skeleton
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

      <Typography
        noWrap
        maxWidth={{ xs: "15em", sm: "25em", md: "30em", lg: "25em" }}
        fontSize="0.9rem"
      >
        {showSkeleton ? (
          <Skeleton variant="rounded" animation="wave" width="15em" />
        ) : (
          line.pv.map(moveLineUciToSan(board.fen())).join(", ")
        )}
      </Typography>
    </ListItem>
  );
}
