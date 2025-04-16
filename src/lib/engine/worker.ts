import { EngineWorker } from "@/types/engine";

export const getEngineWorkers = (enginePath: string): EngineWorker[] => {
  const engineWorkers: EngineWorker[] = [];

  const instanceCount =
    navigator.hardwareConcurrency - (navigator.hardwareConcurrency % 2 ? 0 : 1);

  for (let i = 0; i < instanceCount; i++) {
    const worker = new Worker(enginePath);

    const engineWorker: EngineWorker = {
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
