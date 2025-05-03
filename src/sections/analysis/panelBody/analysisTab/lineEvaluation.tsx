import { LineEval } from "@/types/eval";
import { ListItem, Skeleton, Typography, Box } from "@mui/material";
import { useAtomValue } from "jotai";
import { boardAtom } from "../../states";
import { getLineEvalLabel, moveLineUciToSan, uciMoveParams } from "@/lib/chess";
import { useChessActions } from "@/hooks/useChessActions";

interface Props {
  line: LineEval;
}

export default function LineEvaluation({ line }: Props) {
  const board = useAtomValue(boardAtom);
  const { makeMove } = useChessActions(boardAtom);
  const lineLabel = getLineEvalLabel(line);

  const isBlackCp =
    (line.cp !== undefined && line.cp < 0) ||
    (line.mate !== undefined && line.mate < 0);

  const showSkeleton = line.depth < 6;

  return (
    <ListItem disablePadding>
      <Typography
        marginRight={1.5}
        marginY={0.5}
        paddingY={0.2}
        noWrap
        overflow="visible"
        width="3.5em"
        textAlign="center"
        fontSize="0.8rem"
        sx={{
          backgroundColor: isBlackCp ? "black" : "white",
          color: isBlackCp ? "white" : "black",
        }}
        borderRadius="5px"
        border="1px solid #424242"
        fontWeight="bold"
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
        maxWidth={{ xs: "12em", sm: "25em", md: "30em", lg: "25em" }}
        fontSize="0.9rem"
      >
        {showSkeleton ? (
          <Skeleton variant="rounded" animation="wave" width="15em" />
        ) : (
          <Box component="span">
            {line.pv.map((uci, i) => {
              const san = moveLineUciToSan(board.fen())(uci);
              return (
                <Box
                  component="span"
                  key={i}
                  onClick={() => makeMove(uciMoveParams(uci))}
                  sx={{ cursor: "pointer", textDecoration: "underline", mr: i < line.pv.length - 1 ? 0.5 : 0 }}
                >
                  {san}
                  {i < line.pv.length - 1 && ","}
                </Box>
              );
            })}
          </Box>
        )}
      </Typography>
    </ListItem>
  );
}
