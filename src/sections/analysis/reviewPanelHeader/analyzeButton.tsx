import { Icon } from "@iconify/react";
import {
  engineDepthAtom,
  engineMultiPvAtom,
  evaluationProgressAtom,
  gameAtom,
  gameEvalAtom,
} from "../states";
import { useAtom, useAtomValue } from "jotai";
import { getEvaluateGameParams } from "@/lib/chess";
import { useGameDatabase } from "@/hooks/useGameDatabase";
import { LoadingButton } from "@mui/lab";
import { useEngine } from "@/hooks/useEngine";
import { EngineName } from "@/types/enums";
import { logAnalyticsEvent } from "@/lib/firebase";

export default function AnalyzeButton() {
  const engine = useEngine(EngineName.Stockfish16);
  const [evaluationProgress, setEvaluationProgress] = useAtom(
    evaluationProgressAtom
  );
  const engineDepth = useAtomValue(engineDepthAtom);
  const engineMultiPv = useAtomValue(engineMultiPvAtom);
  const { setGameEval, gameFromUrl } = useGameDatabase();
  const [gameEval, setEval] = useAtom(gameEvalAtom);
  const game = useAtomValue(gameAtom);

  const readyToAnalyse =
    engine?.isReady() && game.history().length > 0 && !evaluationProgress;

  const handleAnalyze = async () => {
    const params = getEvaluateGameParams(game);
    if (!engine?.isReady() || params.fens.length === 0 || evaluationProgress) {
      return;
    }

    const newGameEval = await engine.evaluateGame({
      ...params,
      depth: engineDepth,
      multiPv: engineMultiPv,
      setEvaluationProgress,
    });

    setEval(newGameEval);
    setEvaluationProgress(0);

    if (gameFromUrl) {
      setGameEval(gameFromUrl.id, newGameEval);
    }

    logAnalyticsEvent("analyze_game", {
      engine: EngineName.Stockfish16,
      depth: engineDepth,
      multiPv: engineMultiPv,
      nbPositions: params.fens.length,
    });
  };

  if (evaluationProgress) return null;

  return (
    <LoadingButton
      variant="contained"
      size="small"
      startIcon={<Icon icon="streamline:magnifying-glass-solid" />}
      onClick={handleAnalyze}
      disabled={!readyToAnalyse}
    >
      {gameEval ? "Analyze again" : "Analyze"}
    </LoadingButton>
  );
}
