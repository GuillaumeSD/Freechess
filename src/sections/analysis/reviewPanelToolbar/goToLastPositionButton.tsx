import { Icon } from "@iconify/react";
import { Grid, IconButton, Tooltip } from "@mui/material";
import { useAtomValue } from "jotai";
import { boardAtom, gameAtom } from "../states";
import { useChessActions } from "@/hooks/useChessActions";

export default function GoToLastPositionButton() {
  const { setPgn: setBoardPgn } = useChessActions(boardAtom);
  const game = useAtomValue(gameAtom);
  const board = useAtomValue(boardAtom);

  const gameHistory = game.history();
  const boardHistory = board.history();

  const isButtonDisabled = boardHistory >= gameHistory;

  return (
    <Tooltip title="Go to final position">
      <Grid>
        <IconButton
          onClick={() => {
            if (isButtonDisabled) return;
            setBoardPgn(game.pgn());
          }}
          disabled={isButtonDisabled}
        >
          <Icon icon="ri:skip-forward-line" />
        </IconButton>
      </Grid>
    </Tooltip>
  );
}
