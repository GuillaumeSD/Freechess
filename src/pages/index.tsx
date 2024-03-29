import { useChessActions } from "@/hooks/useChessActions";
import Board from "@/sections/analysis/board";
import MovesClassificationsRecap from "@/sections/analysis/movesClassificationsRecap";
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
  const isLgOrGreater = useMediaQuery(theme.breakpoints.up("lg"));

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
        marginTop={{ xs: 0, lg: "2.5em" }}
        justifyContent="center"
        alignItems="center"
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
        padding={3}
        rowGap={3}
        style={{
          maxWidth: "1100px",
        }}
      >
        {isLgOrGreater ? <ReviewPanelHeader /> : <ReviewPanelToolBar />}

        <Divider sx={{ width: "90%" }} />

        <ReviewPanelBody />

        <Divider sx={{ width: "90%" }} />

        {isLgOrGreater ? <ReviewPanelToolBar /> : <ReviewPanelHeader />}
      </Grid>

      <MovesClassificationsRecap />
    </Grid>
  );
}
