import { useChessActions } from "@/hooks/useChess";
import Board from "@/sections/analysis/board";
import ReviewPanelBody from "@/sections/analysis/reviewPanelBody";
import ReviewPanelHeader from "@/sections/analysis/reviewPanelHeader";
import AnalyzePanel from "@/sections/analysis/reviewPanelHeader/analyzePanel";
import ReviewPanelToolBar from "@/sections/analysis/reviewPanelToolbar";
import ArrowOptions from "@/sections/analysis/reviewPanelToolbar/arrowOptions";
import {
  boardAtom,
  boardOrientationAtom,
  gameAtom,
  gameEvalAtom,
} from "@/sections/analysis/states";
import { Divider, Grid } from "@mui/material";
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
      rowGap={6}
      justifyContent="center"
      alignItems="start"
      marginTop={1}
    >
      <Grid
        item
        container
        justifyContent="center"
        alignItems="center"
        xs={12}
        md={9}
        lg={6}
      >
        <Board />
      </Grid>

      <Grid
        item
        container
        paddingLeft={{ xs: 0, lg: 6 }}
        justifyContent="center"
        alignItems="center"
        xs={12}
        lg={6}
      >
        <Grid
          container
          item
          justifyContent="center"
          alignItems="center"
          borderRadius={2}
          border={1}
          borderColor={"secondary.main"}
          xs={12}
          sx={{
            backgroundColor: "secondary.main",
            borderColor: "primary.main",
            borderWidth: 2,
          }}
          padding={3}
          gap={4}
        >
          <ReviewPanelHeader />

          <Divider sx={{ width: "90%" }} />

          <AnalyzePanel />

          <Divider sx={{ width: "90%" }} />

          <ReviewPanelBody />

          <Divider sx={{ width: "90%" }} />

          <ReviewPanelToolBar />

          <ArrowOptions />
        </Grid>
      </Grid>
    </Grid>
  );
}
