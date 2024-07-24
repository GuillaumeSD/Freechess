import { TooltipProps } from "recharts";
import { ChartItemData } from "./types";
import { getLineEvalLabel } from "@/lib/chess";

export default function CustomTooltip({
  active,
  payload,
}: TooltipProps<number, number>) {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload as ChartItemData;

  return (
    <div
      style={{
        backgroundColor: "#f0f0f0",
        padding: 5,
        color: "black",
        opacity: 0.9,
        border: "1px solid black",
        borderRadius: 3,
      }}
    >
      {getLineEvalLabel(data)}
    </div>
  );
}
