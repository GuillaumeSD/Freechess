import { Icon } from "@iconify/react";
import { useState } from "react";
import {
  engineDepthAtom,
  engineMultiPvAtom,
  gameAtom,
  gameEvalAtom,
} from "../states";
import { useAtomValue, useSetAtom } from "jotai";
import { getFens } from "@/lib/chess";
import { useGameDatabase } from "@/hooks/useGameDatabase";
import { LoadingButton } from "@mui/lab";
import { useEngine } from "@/hooks/useEngine";
import { EngineName } from "@/types/enums";
import { logAnalyticsEvent } from "@/lib/firebase";

export default function AnalyzeButton() {
  const engine = useEngine(EngineName.Stockfish16);
  const [evaluationInProgress, setEvaluationInProgress] = useState(false);
  const engineDepth = useAtomValue(engineDepthAtom);
  const engineMultiPv = useAtomValue(engineMultiPvAtom);
  const { setGameEval, gameFromUrl } = useGameDatabase();
  const setEval = useSetAtom(gameEvalAtom);
  const game = useAtomValue(gameAtom);

  const readyToAnalyse =
    engine?.isReady() && game.history().length > 0 && !evaluationInProgress;

  const handleAnalyze = async () => {
    const gameFens = getFens(game);
    if (!engine?.isReady() || gameFens.length === 0 || evaluationInProgress) {
      return;
    }

    setEvaluationInProgress(true);

    const newGameEval = await engine.evaluateGame(
      gameFens,
      engineDepth,
      engineMultiPv
    );

    setEval(newGameEval);
    setEvaluationInProgress(false);

    if (gameFromUrl) {
      setGameEval(gameFromUrl.id, newGameEval);
    }

    logAnalyticsEvent("analyze_game", {
      engine: EngineName.Stockfish16,
      depth: engineDepth,
      multiPv: engineMultiPv,
      nbPositions: 1,
    });
  };

  return (
    <LoadingButton
      variant="contained"
      size="small"
      startIcon={
        !evaluationInProgress && (
          <Icon icon="streamline:magnifying-glass-solid" />
        )
      }
      onClick={handleAnalyze}
      disabled={!readyToAnalyse}
      loading={evaluationInProgress}
      loadingPosition={evaluationInProgress ? "end" : undefined}
      endIcon={
        evaluationInProgress && (
          <Icon icon="streamline:magnifying-glass-solid" />
        )
      }
    >
      {evaluationInProgress ? "Analyzing..." : "Analyze"}
    </LoadingButton>
  );
}
