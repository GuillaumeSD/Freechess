import { Box, Grid2 as Grid, Grid2Props as GridProps } from "@mui/material";
import { useAtomValue } from "jotai";
import {
  Area,
  AreaChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { currentPositionAtom, gameEvalAtom } from "../../states";
import { useMemo } from "react";
import CustomTooltip from "./tooltip";
import { ChartItemData } from "./types";
import { PositionEval } from "@/types/eval";
import { moveClassificationColors } from "@/lib/chess";
import CustomDot from "./dot";

export default function GraphTab(props: GridProps) {
  const gameEval = useAtomValue(gameEvalAtom);
  const currentPosition = useAtomValue(currentPositionAtom);

  const chartData: ChartItemData[] = useMemo(
    () => gameEval?.positions.map(formatEvalToChartData) ?? [],
    [gameEval]
  );

  const boardMoveColor = currentPosition.eval?.moveClassification
    ? moveClassificationColors[currentPosition.eval.moveClassification]
    : "grey";

  if (!gameEval) return null;

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="start"
      height="100%"
      {...props}
      sx={
        props.hidden
          ? { display: "none" }
          : { marginY: 1, overflow: "hidden", overflowY: "auto", ...props.sx }
      }
    >
      <Box
        width="max(35rem, 90%)"
        maxWidth="100%"
        height="max(8rem, 100%)"
        maxHeight="15rem"
        sx={{
          backgroundColor: "#2e2e2e",
          borderRadius: "15px",
          overflow: "hidden",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            width={500}
            height={400}
            data={chartData}
            margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <XAxis dataKey="moveNb" hide stroke="red" />
            <YAxis domain={[0, 20]} hide />
            <Tooltip
              content={<CustomTooltip />}
              isAnimationActive={false}
              cursor={{
                stroke: "grey",
                strokeWidth: 2,
                strokeOpacity: 0.3,
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="none"
              fill="#ffffff"
              fillOpacity={1}
              activeDot={<CustomDot />}
              isAnimationActive={false}
            />
            <ReferenceLine
              y={10}
              stroke="grey"
              strokeWidth={2}
              strokeOpacity={0.4}
            />
            <ReferenceLine
              x={currentPosition.currentMoveIdx}
              stroke={boardMoveColor}
              strokeWidth={4}
              strokeOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Grid>
  );
}

const formatEvalToChartData = (
  position: PositionEval,
  index: number
): ChartItemData => {
  const line = position.lines[0];

  const chartItem: ChartItemData = {
    moveNb: index,
    value: 10,
    cp: line.cp,
    mate: line.mate,
    moveClassification: position.moveClassification,
  };

  if (line.mate) {
    return {
      ...chartItem,
      value: line.mate > 0 ? 20 : 0,
    };
  }

  if (line.cp) {
    return {
      ...chartItem,
      value: Math.max(Math.min(line.cp / 100, 10), -10) + 10,
    };
  }

  return chartItem;
};
