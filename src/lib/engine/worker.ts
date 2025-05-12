import { EngineWorker } from "@/types/engine";

export const getEngineWorkers = (
  enginePath: string,
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
  const deviceMemory =
    "deviceMemory" in navigator && typeof navigator.deviceMemory === "number"
      ? navigator.deviceMemory
      : 4;
  const workersNb = workersInputNb ?? Math.min(maxWorkersNb, deviceMemory, 10);
  console.log(`Starting ${workersNb} workers from ${enginePath}`);

  for (let i = 0; i < workersNb; i++) {
    const worker = new Worker(enginePath);

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
