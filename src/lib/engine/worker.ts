import { EngineWorker } from "@/types/engine";

export const getEngineWorker = (enginePath: string): EngineWorker => {
  const worker = new Worker(enginePath);

  const engineWorker: EngineWorker = {
    uci: (command: string) => worker.postMessage(command),
    listen: () => null,
    terminate: () => worker.terminate(),
  };

  worker.onmessage = (event) => {
    engineWorker.listen(event.data);
  };

  return engineWorker;
};
