import { Button } from "@mui/material";
import { gameAtom, playerColorAtom } from "./states";
import { useAtomValue } from "jotai";
import { useChessActions } from "@/hooks/useChessActions";
import { Color } from "@/types/enums";

export default function UndoMoveButton() {
  const game = useAtomValue(gameAtom);
  const { goToMove, undoMove } = useChessActions(gameAtom);
  const playerColor = useAtomValue(playerColorAtom);

  const handleClick = () => {
    const gameHistory = game.history();
    const turnColor = game.turn();
    if (
      (turnColor === "w" && playerColor === Color.White) ||
      (turnColor === "b" && playerColor === Color.Black)
    ) {
      if (gameHistory.length < 2) return;
      goToMove(gameHistory.length - 2, game);
    } else {
      if (!gameHistory.length) return;
      undoMove();
    }
  };

  return (
    <Button variant="outlined" onClick={handleClick}>
      Undo your last move
    </Button>
  );
}
