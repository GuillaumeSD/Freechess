import {
  ceilsNumber,
  getHarmonicMean,
  getStandardDeviation,
  getWeightedMean,
} from "@/lib/helpers";
import { Accuracy, MoveEval } from "@/types/eval";
import { getPositionWinPercentage } from "./winPercentage";

export const computeAccuracy = (moves: MoveEval[]): Accuracy => {
  const movesWinPercentage = moves.map(getPositionWinPercentage);

  const weights = getAccuracyWeights(movesWinPercentage);

  const movesAccuracy = getMovesAccuracy(movesWinPercentage);

  const whiteAccuracy = getPlayerAccuracy(movesAccuracy, weights, "white");
  const blackAccuracy = getPlayerAccuracy(movesAccuracy, weights, "black");

  return {
    white: whiteAccuracy,
    black: blackAccuracy,
  };
};

const getPlayerAccuracy = (
  movesAccuracy: number[],
  weights: number[],
  player: "white" | "black"
): number => {
  const remainder = player === "white" ? 0 : 1;
  const playerAccuracies = movesAccuracy.filter(
    (_, index) => index % 2 === remainder
  );
  const playerWeights = weights.filter((_, index) => index % 2 === remainder);

  const weightedMean = getWeightedMean(playerAccuracies, playerWeights);
  const harmonicMean = getHarmonicMean(playerAccuracies);

  return (weightedMean + harmonicMean) / 2;
};

const getAccuracyWeights = (movesWinPercentage: number[]): number[] => {
  const windowSize = ceilsNumber(
    Math.ceil(movesWinPercentage.length / 10),
    2,
    8
  );

  const windows: number[][] = [];
  const halfWindowSize = Math.round(windowSize / 2);

  for (let i = 1; i < movesWinPercentage.length; i++) {
    const startIdx = i - halfWindowSize;
    const endIdx = i + halfWindowSize;

    if (startIdx < 0) {
      windows.push(movesWinPercentage.slice(0, windowSize));
      continue;
    }

    if (endIdx > movesWinPercentage.length) {
      windows.push(movesWinPercentage.slice(-windowSize));
      continue;
    }

    windows.push(movesWinPercentage.slice(startIdx, endIdx));
  }

  const weights = windows.map((window) => {
    const std = getStandardDeviation(window);
    return ceilsNumber(std, 0.5, 12);
  });

  return weights;
};

const getMovesAccuracy = (movesWinPercentage: number[]): number[] =>
  movesWinPercentage.slice(1).map((winPercent, index) => {
    const lastWinPercent = movesWinPercentage[index];
    const winDiff = Math.abs(lastWinPercent - winPercent);

    const rawAccuracy =
      103.1668100711649 * Math.exp(-0.04354415386753951 * winDiff) -
      3.166924740191411;

    return Math.min(100, Math.max(0, rawAccuracy + 1));
  });
