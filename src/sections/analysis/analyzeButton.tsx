import { Stockfish } from "@/lib/engine/stockfish";
import { Icon } from "@iconify/react";
import { Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { gameAtom, gameEvalAtom } from "./states";
import { useAtomValue, useSetAtom } from "jotai";
import { getFens } from "@/lib/chess";
import { useGameDatabase } from "@/hooks/useGameDatabase";

export default function AnalyzeButton() {
  const [engine, setEngine] = useState<Stockfish | null>(null);
  const [evaluationInProgress, setEvaluationInProgress] = useState(false);
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

    const newGameEval = await engine.evaluateGame(gameFens);
    setEval(newGameEval);

    setEvaluationInProgress(false);

    if (gameFromUrl) {
      setGameEval(gameFromUrl.id, newGameEval);
    }
  };

  return (
    <Grid item container xs={12} justifyContent="center" alignItems="center">
      <Button
        variant="contained"
        size="large"
        startIcon={<Icon icon="streamline:magnifying-glass-solid" />}
        onClick={handleAnalyze}
        disabled={!readyToAnalyse}
      >
        Analyse
      </Button>
    </Grid>
  );
}
