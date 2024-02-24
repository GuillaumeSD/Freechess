import { Grid } from "@mui/material";
import { Chessboard } from "react-chessboard";
import { useAtomValue } from "jotai";
import { boardAtom, boardOrientationAtom } from "../states";
import { Arrow, Square } from "react-chessboard/dist/chessboard/types";
import { useChessActions } from "@/hooks/useChess";
import { useCurrentMove } from "@/hooks/useCurrentMove";
import { useMemo } from "react";
import PlayerInfo from "./playerInfo";

export default function Board() {
  const board = useAtomValue(boardAtom);
  const boardOrientation = useAtomValue(boardOrientationAtom);
  const boardActions = useChessActions(boardAtom);
  const currentMove = useCurrentMove();

  const onPieceDrop = (source: Square, target: Square): boolean => {
    try {
      const result = boardActions.move({
        from: source,
        to: target,
        promotion: "q", // TODO: Let the user choose the promotion
      });

      return !!result;
    } catch {
      return false;
    }
  };

  const customArrows: Arrow[] = useMemo(() => {
    if (!currentMove?.lastEval) return [];

    const bestMoveArrow = [
      currentMove.lastEval.bestMove.slice(0, 2),
      currentMove.lastEval.bestMove.slice(2, 4),
      "#3aab18",
    ] as Arrow;

    if (
      !currentMove.from ||
      !currentMove.to ||
      (currentMove.from === bestMoveArrow[0] &&
        currentMove.to === bestMoveArrow[1])
    ) {
      return [bestMoveArrow];
    }

    return [[currentMove.from, currentMove.to, "#ffaa00"], bestMoveArrow];
  }, [currentMove]);

  return (
    <Grid
      item
      container
      rowGap={2}
      justifyContent="center"
      alignItems="center"
      xs={12}
      md={6}
    >
      <PlayerInfo color={boardOrientation ? "black" : "white"} />

      <Grid
        item
        container
        justifyContent="center"
        alignItems="center"
        maxWidth={"80vh"}
      >
        <Chessboard
          id="BasicBoard"
          position={board.fen()}
          onPieceDrop={onPieceDrop}
          boardOrientation={boardOrientation ? "white" : "black"}
          customArrows={customArrows}
        />
      </Grid>

      <PlayerInfo color={boardOrientation ? "white" : "black"} />
    </Grid>
  );
}
