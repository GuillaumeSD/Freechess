export const ceilsNumber = (number: number, min: number, max: number) => {
  if (number > max) return max;
  if (number < min) return min;
  return number;
};

export const getHarmonicMean = (array: number[]) => {
  const sum = array.reduce((acc, curr) => acc + 1 / curr, 0);
  return array.length / sum;
};

export const getStandardDeviation = (array: number[]) => {
  const n = array.length;
  const mean = array.reduce((a, b) => a + b) / n;
  return Math.sqrt(
    array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n
  );
};

export const getWeightedMean = (array: number[], weights: number[]) => {
  if (array.length > weights.length)
    throw new Error("Weights array is too short");

  const weightedSum = array.reduce(
    (acc, curr, index) => acc + curr * weights[index],
    0
  );
  const weightSum = weights
    .slice(0, array.length)
    .reduce((acc, curr) => acc + curr, 0);

  return weightedSum / weightSum;
};
