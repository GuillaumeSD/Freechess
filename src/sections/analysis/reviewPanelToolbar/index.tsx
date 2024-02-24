import { Divider, Grid, IconButton, Tooltip } from "@mui/material";
import { Icon } from "@iconify/react";
import { useAtomValue } from "jotai";
import { boardAtom } from "../states";
import { useChessActions } from "@/hooks/useChess";
import FlipBoardButton from "./flipBoardButton";
import NextMoveButton from "./nextMoveButton";
import GoToLastPositionButton from "./goToLastPositionButton";
import SaveButton from "./saveButton";
import ArrowOptions from "./arrowOptions";

export default function ReviewPanelToolBar() {
  const board = useAtomValue(boardAtom);
  const boardActions = useChessActions(boardAtom);

  const boardHistory = board.history();

  return (
    <>
      <Divider sx={{ width: "90%", marginY: 3 }} />

      <Grid container item justifyContent="center" alignItems="center" xs={12}>
        <FlipBoardButton />

        <Tooltip title="Reset board">
          <Grid>
            <IconButton
              onClick={() => boardActions.reset()}
              disabled={boardHistory.length === 0}
            >
              <Icon icon="ri:skip-back-line" />
            </IconButton>
          </Grid>
        </Tooltip>

        <Tooltip title="Go to previous move">
          <Grid>
            <IconButton
              onClick={() => boardActions.undo()}
              disabled={boardHistory.length === 0}
            >
              <Icon icon="ri:arrow-left-s-line" height={30} />
            </IconButton>
          </Grid>
        </Tooltip>

        <NextMoveButton />

        <GoToLastPositionButton />

        <SaveButton />
      </Grid>

      <ArrowOptions />
    </>
  );
}
