import { useChessActions } from "@/hooks/useChess";
import Board from "@/sections/analysis/board";
import ReviewPanelBody from "@/sections/analysis/reviewPanelBody";
import ReviewPanelHeader from "@/sections/analysis/reviewPanelHeader";
import ReviewPanelToolBar from "@/sections/analysis/reviewPanelToolbar";
import {
  boardAtom,
  boardOrientationAtom,
  gameAtom,
  gameEvalAtom,
} from "@/sections/analysis/states";
import { Grid } from "@mui/material";
import { Chess } from "chess.js";
import { useSetAtom } from "jotai";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function GameReport() {
  const boardActions = useChessActions(boardAtom);
  const gameActions = useChessActions(gameAtom);
  const setEval = useSetAtom(gameEvalAtom);
  const setBoardOrientation = useSetAtom(boardOrientationAtom);
  const router = useRouter();
  const { gameId } = router.query;

  useEffect(() => {
    if (!gameId) {
      boardActions.reset();
      setEval(undefined);
      setBoardOrientation(true);
      gameActions.setPgn(new Chess().pgn());
    }
  }, [gameId]);

  return (
    <Grid
      container
      rowGap={2}
      justifyContent="center"
      alignItems="center"
      marginTop={1}
    >
      <Board />

      <Grid
        item
        container
        rowGap={2}
        paddingLeft={{ xs: 0, lg: 6 }}
        justifyContent="center"
        alignItems="center"
        xs={12}
        lg={6}
      >
        <Grid
          container
          item
          rowGap={3}
          columnGap={1}
          justifyContent="center"
          alignItems="center"
          borderRadius={2}
          border={1}
          borderColor={"secondary.main"}
          xs={12}
          sx={{
            backgroundColor: "secondary.main",
            borderRadius: 2,
            borderColor: "primary.main",
            borderWidth: 2,
          }}
          paddingY={3}
        >
          <ReviewPanelHeader />

          <ReviewPanelBody />

          <ReviewPanelToolBar />
        </Grid>
      </Grid>
    </Grid>
  );
}
