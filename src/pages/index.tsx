import { useChessActions } from "@/hooks/useChessActions";
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
import { Divider, Grid, useMediaQuery, useTheme } from "@mui/material";
import { Chess } from "chess.js";
import { useSetAtom } from "jotai";
import { useRouter } from "next/router";
import { useEffect } from "react";
import ClassificationPanel from "@/sections/analysis/reviewPanelBody/classificationPanel";

export default function GameReport() {
  const theme = useTheme();
  const isLgOrGreater = useMediaQuery(theme.breakpoints.up("lg"));

  const { reset: resetBoard } = useChessActions(boardAtom);
  const { setPgn: setGamePgn } = useChessActions(gameAtom);
  const setGameEval = useSetAtom(gameEvalAtom);
  const setBoardOrientation = useSetAtom(boardOrientationAtom);

  const router = useRouter();
  const { gameId } = router.query;

  useEffect(() => {
    if (!gameId) {
      resetBoard();
      setGameEval(undefined);
      setBoardOrientation(true);
      setGamePgn(new Chess().pgn());
    }
  }, [gameId, setGameEval, setBoardOrientation, resetBoard, setGamePgn]);

  return (
    <Grid container gap={4} justifyContent="space-evenly" alignItems="center">
      <Board />

      <Grid
        container
        item
        borderRadius={2}
        border={1}
        borderColor={"secondary.main"}
        xs={12}
        lg
        sx={{
          backgroundColor: "secondary.main",
          borderColor: "primary.main",
          borderWidth: 2,
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
        }}
        padding={2.5}
        style={{
          maxWidth: "1200px",
        }}
        display="grid"
      >
        <Grid
          container
          item
          justifyContent="center"
          alignItems="center"
          xs={12}
          rowGap={2}
          maxHeight={{ lg: "calc(98vh - 150px)", xs: "900px" }}
          display="grid"
          gridTemplateRows="repeat(4, auto) fit-content(100%)"
        >
          {isLgOrGreater ? <ReviewPanelHeader /> : <ReviewPanelToolBar />}

          <Divider sx={{ marginX: "5%" }} />

          <ReviewPanelBody />

          <ClassificationPanel />

          <Divider sx={{ marginX: "5%" }} />

          {isLgOrGreater ? <ReviewPanelToolBar /> : <ReviewPanelHeader />}
        </Grid>
      </Grid>
    </Grid>
  );
}
