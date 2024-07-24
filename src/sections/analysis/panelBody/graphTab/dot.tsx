import { DotProps } from "recharts";
import { ChartItemData } from "./types";
import { useAtomValue } from "jotai";
import { boardAtom, gameAtom } from "../../states";
import { useChessActions } from "@/hooks/useChessActions";
import { moveClassificationColors } from "@/lib/chess";

export default function CustomDot({
  cx,
  cy,
  r,
  payload,
}: DotProps & { payload?: ChartItemData }) {
  const { goToMove } = useChessActions(boardAtom);
  const game = useAtomValue(gameAtom);

  const handleDotClick = () => {
    if (!payload) return;
    goToMove(payload.moveNb, game);
  };

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
      onClick={handleDotClick}
      cursor="pointer"
    />
  );
}
