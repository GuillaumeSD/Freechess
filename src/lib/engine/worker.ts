import { EngineWorker } from "@/types/engine";

export const getEngineWorkers = (
  workerFactory: () => Worker,
  workersInputNb?: number
): EngineWorker[] => {
  if (workersInputNb !== undefined && workersInputNb < 1) {
    throw new Error(
      `Number of workers must be greater than 0, got ${workersInputNb} instead`
    );
  }

  const engineWorkers: EngineWorker[] = [];

  const maxWorkersNb = Math.max(
    1,
    navigator.hardwareConcurrency - 4,
    Math.ceil((navigator.hardwareConcurrency * 2) / 3)
  );
  const workersNb = workersInputNb ?? maxWorkersNb;

  for (let i = 0; i < workersNb; i++) {
    const worker = workerFactory();

    const engineWorker: EngineWorker = {
      isReady: false,
      uci: (command: string) => worker.postMessage(command),
      listen: () => null,
      terminate: () => worker.terminate(),
    };

    worker.onmessage = (event) => {
      engineWorker.listen(event.data);
    };

    engineWorkers.push(engineWorker);
  }

  return engineWorkers;
};
