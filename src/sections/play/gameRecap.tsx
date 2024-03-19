import { useAtomValue } from "jotai";
import { gameAtom, isGameInProgressAtom, playerColorAtom } from "./states";
import { Grid, Typography } from "@mui/material";
import { Color } from "@/types/enums";

export default function GameRecap() {
  const game = useAtomValue(gameAtom);
  const playerColor = useAtomValue(playerColorAtom);
  const isGameInProgress = useAtomValue(isGameInProgressAtom);

  if (isGameInProgress) return null;

  const getResultLabel = () => {
    if (game.isCheckmate()) {
      const winnerColor = game.turn() === "w" ? Color.Black : Color.White;
      const winnerLabel = winnerColor === playerColor ? "You" : "Stockfish";
      return `${winnerLabel} won by checkmate !`;
    }
    if (game.isDraw()) {
      if (game.isInsufficientMaterial()) return "Draw by insufficient material";
      if (game.isStalemate()) return "Draw by stalemate";
      if (game.isThreefoldRepetition()) return "Draw by threefold repetition";
      return "Draw by fifty-move rule";
    }
    return "You resigned";
  };

  return (
    <Grid
      item
      container
      xs={12}
      justifyContent="center"
      alignItems="center"
      gap={1}
    >
      <Typography>{getResultLabel()}</Typography>
    </Grid>
  );
}
