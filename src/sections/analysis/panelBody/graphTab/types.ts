import { MoveClassification } from "@/types/enums";

export interface ChartItemData {
  moveNb: number;
  value: number;
  cp?: number;
  mate?: number;
  moveClassification?: MoveClassification;
}
