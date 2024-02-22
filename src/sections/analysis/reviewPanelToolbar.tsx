import { Divider, Grid, IconButton } from "@mui/material";
import { Icon } from "@iconify/react";
import { useAtomValue } from "jotai";
import { boardAtom, gameAtom } from "./states";
import { useChessActions } from "@/hooks/useChess";

export default function ReviewPanelToolBar() {
  const game = useAtomValue(gameAtom);
  const board = useAtomValue(boardAtom);
  const boardActions = useChessActions(boardAtom);

  const addNextMoveToGame = () => {
    const nextMoveIndex = board.history().length;
    const nextMove = game.history({ verbose: true })[nextMoveIndex];

    if (nextMove) {
      boardActions.move({
        from: nextMove.from,
        to: nextMove.to,
        promotion: nextMove.promotion,
      });
    }
  };

  return (
    <>
      <Divider sx={{ width: "90%", marginY: 3 }} />

      <Grid container item justifyContent="center" alignItems="center" xs={12}>
        <IconButton>
          <Icon icon="eva:flip-fill" />
        </IconButton>
        <IconButton onClick={() => boardActions.reset()}>
          <Icon icon="ri:skip-back-line" />
        </IconButton>
        <IconButton onClick={() => boardActions.undo()}>
          <Icon icon="ri:arrow-left-s-line" height={30} />
        </IconButton>
        <IconButton onClick={() => addNextMoveToGame()}>
          <Icon icon="ri:arrow-right-s-line" height={30} />
        </IconButton>
        <IconButton>
          <Icon icon="ri:skip-forward-line" />
        </IconButton>
        <IconButton>
          <Icon icon="ri:save-3-line" />
        </IconButton>
      </Grid>
    </>
  );
}
