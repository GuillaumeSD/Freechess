import { useEffect, useState } from "react";
import ReviewResult from "./reviewResult";
import SelectDepth from "./selectDepth";
import SelectGameOrigin from "./selectGame/selectGameOrigin";
import { Stockfish } from "@/lib/engine/stockfish";
import { useAtomValue } from "jotai";
import { gameFensAtom } from "./selectGame/gameOrigin.state";

export default function ReviewPanelBody() {
  const [engine, setEngine] = useState<Stockfish | null>(null);
  const gameFens = useAtomValue(gameFensAtom);

  useEffect(() => {
    const engine = new Stockfish();
    engine.init().then(() => {
      console.log("Engine initialized");
    });
    setEngine(engine);

    return () => {
      engine.shutdown();
      console.log("Engine shutdown");
    };
  }, []);

  const handleAnalyse = () => {
    if (engine?.isReady() && gameFens) {
      engine.evaluateGame(gameFens);
    }
  };

  return (
    <div id="review-panel-main">
      <h1 id="review-panel-title" className="white">
        📑 Game Report
      </h1>

      <SelectGameOrigin />

      <button id="review-button" className="std-btn success-btn white">
        <img src="analysis_icon.png" height="25" />
        <b onClick={handleAnalyse}>Analyse</b>
      </button>

      <SelectDepth />

      {false && <progress id="evaluation-progress-bar" max="100" />}

      <b id="status-message" />

      <b id="secondary-message" className="white" />

      {false && <ReviewResult />}
    </div>
  );
}
