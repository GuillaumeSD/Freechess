import { Stockfish16 } from "@/lib/engine/stockfish16";
import { UciEngine } from "@/lib/engine/uciEngine";
import { engineMultiPvAtom } from "@/sections/analysis/states";
import { EngineName } from "@/types/enums";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

export const useEngine = (engineName: EngineName | undefined) => {
  const [engine, setEngine] = useState<UciEngine | null>(null);
  const multiPv = useAtomValue(engineMultiPvAtom);

  const pickEngine = (engine: EngineName): UciEngine => {
    switch (engine) {
      case EngineName.Stockfish16:
        return new Stockfish16(multiPv);
    }
  };

  useEffect(() => {
    if (!engineName) return;

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
