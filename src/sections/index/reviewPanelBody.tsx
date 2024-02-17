import { useEffect, useState } from "react";
import ReviewResult from "./reviewResult";
import SelectDepth from "./selectDepth";
import SelectGameOrigin from "./selectGame/selectGameOrigin";
import { Stockfish } from "@/lib/engine/stockfish";
import { useAtomValue, useSetAtom } from "jotai";
import { boardPgnAtom, gameEvalAtom, gamePgnAtom } from "./index.state";
import { getGameFens, initPgn } from "@/lib/chess";

export default function ReviewPanelBody() {
  const [engine, setEngine] = useState<Stockfish | null>(null);
  const setGameEval = useSetAtom(gameEvalAtom);
  const setBoardPgn = useSetAtom(boardPgnAtom);
  const gamePgn = useAtomValue(gamePgnAtom);

  useEffect(() => {
    const engine = new Stockfish();
    engine.init();
    setEngine(engine);

    return () => {
      engine.shutdown();
    };
  }, []);

  const handleAnalyse = async () => {
    setBoardPgn(initPgn);
    const gameFens = getGameFens(gamePgn);
    if (engine?.isReady() && gameFens.length) {
      const newGameEval = await engine.evaluateGame(gameFens);
      setGameEval(newGameEval);
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

      <ReviewResult />
    </div>
  );
}
