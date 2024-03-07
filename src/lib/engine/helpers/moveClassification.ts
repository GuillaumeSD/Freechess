import { PositionEval } from "@/types/eval";
import { getPositionWinPercentage } from "./winPercentage";
import { MoveClassification } from "@/types/enums";
import { openings } from "@/data/openings";

export const getMovesClassification = (
  rawPositions: PositionEval[],
  uciMoves: string[],
  fens: string[]
): PositionEval[] => {
  const positionsWinPercentage = rawPositions.map(getPositionWinPercentage);
  let currentOpening: string | undefined = undefined;

  const positions = rawPositions.map((rawPosition, index) => {
    if (index === 0) return rawPosition;

    const currentFen = fens[index].split(" ")[0];
    const opening = openings.find((opening) => opening.fen === currentFen);
    if (opening) {
      currentOpening = opening.name;
      return {
        ...rawPosition,
        opening: opening.name,
        moveClassification: MoveClassification.Book,
      };
    }

    const uciMove = uciMoves[index - 1];
    const bestMove = rawPositions[index - 1].bestMove;
    if (uciMove === bestMove) {
      return {
        ...rawPosition,
        opening: currentOpening,
        moveClassification: MoveClassification.Best,
      };
    }

    const lastPositionWinPercentage = positionsWinPercentage[index - 1];
    const positionWinPercentage = positionsWinPercentage[index];
    const isWhiteMove = index % 2 === 1;

    const moveClassification = getMoveClassification(
      lastPositionWinPercentage,
      positionWinPercentage,
      isWhiteMove
    );

    return {
      ...rawPosition,
      opening: currentOpening,
      moveClassification,
    };
  });

  return positions;
};

const getMoveClassification = (
  lastPositionWinPercentage: number,
  positionWinPercentage: number,
  isWhiteMove: boolean
): MoveClassification => {
  const winPercentageDiff =
    (positionWinPercentage - lastPositionWinPercentage) *
    (isWhiteMove ? 1 : -1);

  if (winPercentageDiff < -15) return MoveClassification.Blunder;
  if (winPercentageDiff < -10) return MoveClassification.Mistake;
  if (winPercentageDiff < -5) return MoveClassification.Inaccuracy;
  if (winPercentageDiff < 0) return MoveClassification.Good;
  return MoveClassification.Excellent;
};
