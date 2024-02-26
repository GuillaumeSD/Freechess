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
import { Divider, Grid, useMediaQuery, useTheme } from "@mui/material";
import { Chess } from "chess.js";
import { useSetAtom } from "jotai";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function GameReport() {
  const theme = useTheme();
  const isMdOrGreater = useMediaQuery(theme.breakpoints.up("md"));

  const { reset: resetBoard } = useChessActions(boardAtom);
  const { setPgn: setGamePgn } = useChessActions(gameAtom);
  const setEval = useSetAtom(gameEvalAtom);
  const setBoardOrientation = useSetAtom(boardOrientationAtom);

  const router = useRouter();
  const { gameId } = router.query;

  useEffect(() => {
    if (!gameId) {
      resetBoard();
      setEval(undefined);
      setBoardOrientation(true);
      setGamePgn(new Chess().pgn());
    }
  }, [gameId, setEval, setBoardOrientation, resetBoard, setGamePgn]);

  return (
    <Grid container gap={4} justifyContent="space-evenly" alignItems="start">
      <Board />

      <Grid
        container
        item
        marginTop={{ xs: 0, md: "2.5em" }}
        justifyContent="center"
        alignItems="center"
        borderRadius={2}
        border={1}
        borderColor={"secondary.main"}
        xs={12}
        md
        sx={{
          backgroundColor: "secondary.main",
          borderColor: "primary.main",
          borderWidth: 2,
        }}
        padding={3}
        gap={3}
        style={{
          maxWidth: "1100px",
        }}
      >
        {isMdOrGreater ? <ReviewPanelHeader /> : <ReviewPanelToolBar />}

        <Divider sx={{ width: "90%" }} />

        <ReviewPanelBody />

        <Divider sx={{ width: "90%" }} />

        {isMdOrGreater ? <ReviewPanelToolBar /> : <ReviewPanelHeader />}
      </Grid>
    </Grid>
  );
}
