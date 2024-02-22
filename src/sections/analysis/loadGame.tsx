import { Grid } from "@mui/material";
import LoadGameButton from "../loadGame/loadGameButton";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useChessActions } from "@/hooks/useChess";
import { boardAtom, gameAtom } from "./states";
import { useGameDatabase } from "@/hooks/useGameDatabase";

export default function LoadGame() {
  const router = useRouter();
  const { gameId } = router.query;
  const gameActions = useChessActions(gameAtom);
  const boardActions = useChessActions(boardAtom);
  const { getGame } = useGameDatabase();

  useEffect(() => {
    const loadGame = async () => {
      if (typeof gameId !== "string") return;

      const game = await getGame(parseInt(gameId));
      if (!game) return;

      boardActions.reset();
      gameActions.setPgn(game.pgn);
    };

    loadGame();
  }, [gameId]);

  if (!router.isReady || gameId) return null;

  return (
    <Grid item container xs={12} justifyContent="center" alignItems="center">
      <LoadGameButton
        setGame={(game) => {
          boardActions.reset();
          gameActions.setPgn(game.pgn());
        }}
      />
    </Grid>
  );
}
