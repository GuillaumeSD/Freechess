import { Stockfish16 } from "@/lib/engine/stockfish16";
import { UciEngine } from "@/lib/engine/uciEngine";
import { EngineName } from "@/types/enums";
import { useEffect, useState } from "react";

export const useEngine = (engineName: EngineName) => {
  const [engine, setEngine] = useState<UciEngine | null>(null);

  const pickEngine = (engine: EngineName): UciEngine => {
    switch (engine) {
      case EngineName.Stockfish16:
        return new Stockfish16();
    }
  };

  useEffect(() => {
    const engine = pickEngine(engineName);
    engine.init().then(() => {
      setEngine(engine);
    });

    return () => {
      engine.shutdown();
    };
  }, []);

  return engine;
};
