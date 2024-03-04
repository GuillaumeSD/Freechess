import { ceilsNumber } from "@/lib/helpers";
import { MoveEval } from "@/types/eval";

export const getPositionWinPercentage = (move: MoveEval): number => {
  if (move.lines[0].cp !== undefined) {
    return getWinPercentageFromCp(move.lines[0].cp);
  }

  if (move.lines[0].mate !== undefined) {
    return getWinPercentageFromMate(move.lines[0].mate);
  }

  throw new Error("No cp or mate in move");
};

const getWinPercentageFromMate = (mate: number): number => {
  const mateInf = mate * Infinity;
  return getWinPercentageFromCp(mateInf);
};

const getWinPercentageFromCp = (cp: number): number => {
  const cpCeiled = ceilsNumber(cp, -1000, 1000);
  const MULTIPLIER = -0.00368208;
  const winChances = 2 / (1 + Math.exp(MULTIPLIER * cpCeiled)) - 1;
  return 50 + 50 * winChances;
};
