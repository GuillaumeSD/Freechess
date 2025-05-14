export interface EngineWorker {
  isReady: boolean;
  uci(command: string): void;
  listen: (data: string) => void;
  terminate: () => void;
}

export interface WorkerJob {
  commands: string[];
  finalMessage: string;
  onNewMessage?: (messages: string[]) => void;
  resolve: (messages: string[]) => void;
}
