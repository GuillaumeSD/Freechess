export interface EngineWorker {
  uci(command: string): void;
  listen: (data: string) => void;
  terminate?: () => void;
  setNnueBuffer?: (data: Uint8Array, index?: number) => void;
}
