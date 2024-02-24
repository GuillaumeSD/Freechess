import { Grid } from "@mui/material";
import LoadGameButton from "../../loadGame/loadGameButton";
import { useCallback, useEffect } from "react";
import { useChessActions } from "@/hooks/useChess";
import {
  boardAtom,
  boardOrientationAtom,
  gameAtom,
  gameEvalAtom,
} from "../states";
import { useGameDatabase } from "@/hooks/useGameDatabase";
import { useAtomValue, useSetAtom } from "jotai";
import { Chess } from "chess.js";

export default function LoadGame() {
  const game = useAtomValue(gameAtom);
  const gameActions = useChessActions(gameAtom);
  const boardActions = useChessActions(boardAtom);
  const { gameFromUrl } = useGameDatabase();
  const setEval = useSetAtom(gameEvalAtom);
  const setBoardOrientation = useSetAtom(boardOrientationAtom);

  const resetAndSetGamePgn = useCallback(
    (pgn: string) => {
      boardActions.reset();
      setEval(undefined);
      setBoardOrientation(true);
      gameActions.setPgn(pgn);
    },
    [boardActions, gameActions, setEval, setBoardOrientation]
  );

  useEffect(() => {
    const loadGame = async () => {
      if (!gameFromUrl) return;

      const gamefromDbChess = new Chess();
      gamefromDbChess.loadPgn(gameFromUrl.pgn);
      if (game.history().join() === gamefromDbChess.history().join()) return;

      resetAndSetGamePgn(gameFromUrl.pgn);
      setEval(gameFromUrl.eval);
    };

    loadGame();
  }, [gameFromUrl, game, resetAndSetGamePgn, setEval]);

  if (gameFromUrl) return null;

  return (
    <Grid item container xs={12} justifyContent="center" alignItems="center">
      <LoadGameButton setGame={(game) => resetAndSetGamePgn(game.pgn())} />
    </Grid>
  );
}
