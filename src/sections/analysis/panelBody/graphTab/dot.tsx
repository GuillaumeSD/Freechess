import { DotProps } from "recharts";
import { ChartItemData } from "./types";
import { moveClassificationColors } from "@/lib/chess";

export default function CustomDot({
  cx,
  cy,
  r,
  payload,
}: DotProps & { payload?: ChartItemData }) {
  const moveColor = payload?.moveClassification
    ? moveClassificationColors[payload.moveClassification]
    : "grey";

  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      stroke={moveColor}
      strokeWidth={5}
      fill={moveColor}
      fillOpacity={1}
    />
  );
}
