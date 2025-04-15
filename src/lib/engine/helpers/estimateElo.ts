import { ceilsNumber } from "@/lib/math";
import { EstimatedElo, PositionEval } from "@/types/eval";

export const estimateEloFromEngineOutput = (
  positions: PositionEval[]
): EstimatedElo => {
  try {
    if (!positions || positions.length === 0) {
      return { white: null, black: null };
    }

    let totalCPLWhite = 0;
    let totalCPLBlack = 0;
    let moveCount = 0;
    let previousCp = null;
    let flag = true;
    for (const moveAnalysis of positions) {
      if (moveAnalysis.lines && moveAnalysis.lines.length > 0) {
        const bestLine = moveAnalysis.lines[0];
        if (bestLine.cp !== undefined) {
          if (previousCp !== null) {
            const diff = Math.abs(bestLine.cp - previousCp);
            if (flag) {
              totalCPLWhite += ceilsNumber(diff, -1000, 1000);
            } else {
              totalCPLBlack += ceilsNumber(diff, -1000, 1000);
            }
            flag = !flag;
            moveCount++;
          }
          previousCp = bestLine.cp;
        }
      }
    }

    if (moveCount === 0) {
      return { white: null, black: null };
    }

    const averageCPLWhite = totalCPLWhite / Math.ceil(moveCount / 2);
    const averageCPLBlack = totalCPLBlack / Math.floor(moveCount / 2);

    const estimateElo = (averageCPL: number) =>
      3100 * Math.exp(-0.01 * averageCPL);

    const whiteElo = estimateElo(Math.abs(averageCPLWhite));
    const blackElo = estimateElo(Math.abs(averageCPLBlack));

    return { white: whiteElo, black: blackElo };
  } catch (error) {
    console.error("Error estimating Elo: ", error);
    return { white: null, black: null };
  }
};
