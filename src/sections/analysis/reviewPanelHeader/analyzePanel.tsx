import { Stockfish } from "@/lib/engine/stockfish";
import { Icon } from "@iconify/react";
import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
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
import Slider from "@/components/slider";

export default function AnalyzePanel() {
  const [engine, setEngine] = useState<Stockfish | null>(null);
  const [evaluationInProgress, setEvaluationInProgress] = useState(false);
  const engineDepth = useAtomValue(engineDepthAtom);
  const engineMultiPv = useAtomValue(engineMultiPvAtom);
  const { setGameEval, gameFromUrl } = useGameDatabase();
  const setEval = useSetAtom(gameEvalAtom);
  const game = useAtomValue(gameAtom);

  useEffect(() => {
    const engine = new Stockfish();
    engine.init().then(() => {
      setEngine(engine);
    });

    return () => {
      engine.shutdown();
    };
  }, []);

  const readyToAnalyse =
    engine?.isReady() && game.history().length > 0 && !evaluationInProgress;

  const handleAnalyze = async () => {
    const gameFens = getFens(game);
    if (!engine?.isReady() || gameFens.length === 0 || evaluationInProgress)
      return;

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
  };

  return (
    <Grid
      item
      container
      xs={12}
      justifyContent="center"
      alignItems="center"
      rowGap={4}
    >
      <Slider label="Maximum depth" atom={engineDepthAtom} min={10} max={30} />

      <Slider
        label="Number of lines"
        atom={engineMultiPvAtom}
        min={1}
        max={6}
        xs={6}
      />

      <Grid
        item
        container
        xs={12}
        justifyContent="center"
        alignItems="center"
        marginTop={1}
      >
        <LoadingButton
          variant="contained"
          size="large"
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
      </Grid>
    </Grid>
  );
}
