import { Box, Grid, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { boardAtom, boardOrientationAtom, currentMoveAtom } from "../states";
import { getEvaluationBarValue } from "@/lib/chess";

interface Props {
  height: number;
}

export default function EvaluationBar({ height }: Props) {
  const [evalBar, setEvalBar] = useState({
    whiteBarPercentage: 50,
    label: "0.0",
  });
  const board = useAtomValue(boardAtom);
  const boardOrientation = useAtomValue(boardOrientationAtom);
  const currentMove = useAtomValue(currentMoveAtom);

  useEffect(() => {
    const bestLine = currentMove?.eval?.lines[0];
    if (!bestLine) return;

    const evalBar = getEvaluationBarValue(bestLine, board.turn() === "w");
    setEvalBar(evalBar);
  }, [currentMove, board.turn()]);

  return (
    <Grid
      item
      container
      justifyContent="center"
      alignItems="center"
      width="2rem"
      height={height}
    >
      <Box
        sx={{ backgroundColor: boardOrientation ? "secondary.main" : "white" }}
        height={`${
          boardOrientation
            ? 100 - evalBar.whiteBarPercentage
            : evalBar.whiteBarPercentage
        }%`}
        width="100%"
        borderRadius="5px 5px 0 0"
      >
        <Typography
          color={boardOrientation ? "white" : "black"}
          textAlign="center"
          width="100%"
        >
          {(evalBar.whiteBarPercentage < 50 && boardOrientation) ||
          (evalBar.whiteBarPercentage >= 50 && !boardOrientation)
            ? evalBar.label
            : ""}
        </Typography>
      </Box>

      <Box
        sx={{ backgroundColor: boardOrientation ? "white" : "secondary.main" }}
        height={`${
          boardOrientation
            ? evalBar.whiteBarPercentage
            : 100 - evalBar.whiteBarPercentage
        }%`}
        width={"100%"}
        display="flex"
        alignItems="flex-end"
        borderRadius="0 0 5px 5px"
      >
        <Typography
          color={boardOrientation ? "black" : "white"}
          textAlign="center"
          width="100%"
        >
          {(evalBar.whiteBarPercentage >= 50 && boardOrientation) ||
          (evalBar.whiteBarPercentage < 50 && !boardOrientation)
            ? evalBar.label
            : ""}
        </Typography>
      </Box>
    </Grid>
  );
}
