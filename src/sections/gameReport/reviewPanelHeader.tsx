import { useEffect, useState } from "react";
import SelectGameOrigin from "./selectGame/selectGameOrigin";
import { Stockfish } from "@/lib/engine/stockfish";
import { Icon } from "@iconify/react";
import { Button, Typography } from "@mui/material";
import { useAtomValue, useSetAtom } from "jotai";
import { boardAtom, gameAtom, gameEvalAtom } from "./states";
import { useChessActions } from "@/hooks/useChess";
import { gameInputPgnAtom } from "./selectGame/gameInput.states";
import { pgnToFens } from "@/lib/chess";

export default function ReviewPanelHeader() {
  const [engine, setEngine] = useState<Stockfish | null>(null);
  const setEval = useSetAtom(gameEvalAtom);
  const boardActions = useChessActions(boardAtom);
  const gameActions = useChessActions(gameAtom);
  const pgnInput = useAtomValue(gameInputPgnAtom);

  useEffect(() => {
    const engine = new Stockfish();
    engine.init();
    setEngine(engine);

    return () => {
      engine.shutdown();
    };
  }, []);

  const handleAnalyse = async () => {
    boardActions.reset();
    gameActions.setPgn(pgnInput);
    const gameFens = pgnToFens(pgnInput);
    if (engine?.isReady() && gameFens.length) {
      const newGameEval = await engine.evaluateGame(gameFens);
      setEval(newGameEval);
    }
  };

  return (
    <>
      <Icon icon="ph:file-magnifying-glass-fill" height={40} />
      <Typography variant="h4" align="center">
        Game Report
      </Typography>

      <SelectGameOrigin />

      <Button
        variant="contained"
        size="large"
        startIcon={<Icon icon="streamline:magnifying-glass-solid" />}
        onClick={handleAnalyse}
      >
        Analyse
      </Button>
    </>
  );
}
