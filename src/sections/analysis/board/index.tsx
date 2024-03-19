import { Grid } from "@mui/material";
import { Chessboard } from "react-chessboard";
import { useAtomValue, useSetAtom } from "jotai";
import {
  boardAtom,
  boardOrientationAtom,
  clickedSquaresAtom,
  currentPositionAtom,
  playableSquaresAtom,
  showBestMoveArrowAtom,
} from "../states";
import { Arrow, Square } from "react-chessboard/dist/chessboard/types";
import { useChessActions } from "@/hooks/useChessActions";
import { useEffect, useMemo, useRef } from "react";
import PlayerInfo from "./playerInfo";
import EvaluationBar from "./evaluationBar";
import { useScreenSize } from "@/hooks/useScreenSize";
import { MoveClassification } from "@/types/enums";
import SquareRenderer, { moveClassificationColors } from "./squareRenderer";

export default function Board() {
  const boardRef = useRef<HTMLDivElement>(null);
  const { boardSize } = useScreenSize();
  const board = useAtomValue(boardAtom);
  const boardOrientation = useAtomValue(boardOrientationAtom);
  const showBestMoveArrow = useAtomValue(showBestMoveArrowAtom);
  const { makeMove: makeBoardMove } = useChessActions(boardAtom);
  const position = useAtomValue(currentPositionAtom);
  const setClickedSquares = useSetAtom(clickedSquaresAtom);
  const setPlayableSquares = useSetAtom(playableSquaresAtom);

  const boardFen = board.fen();

  useEffect(() => {
    setClickedSquares([]);
  }, [boardFen, setClickedSquares]);

  const onPieceDrop = (
    source: Square,
    target: Square,
    piece: string
  ): boolean => {
    try {
      const result = makeBoardMove({
        from: source,
        to: target,
        promotion: piece[1]?.toLowerCase() ?? "q",
      });

      return !!result;
    } catch {
      return false;
    }
  };

  const handleSquareLeftClick = () => {
    setClickedSquares([]);
  };

  const handleSquareRightClick = (square: Square) => {
    setClickedSquares((prev) =>
      prev.includes(square)
        ? prev.filter((s) => s !== square)
        : [...prev, square]
    );
  };

  const handlePieceDragBegin = (_: string, square: Square) => {
    const moves = board.moves({ square, verbose: true });
    setPlayableSquares(moves.map((m) => m.to));
  };

  const handlePieceDragEnd = () => {
    setPlayableSquares([]);
  };

  const customArrows: Arrow[] = useMemo(() => {
    const bestMove = position?.lastEval?.bestMove;
    const moveClassification = position?.eval?.moveClassification;

    if (
      bestMove &&
      showBestMoveArrow &&
      moveClassification !== MoveClassification.Book
    ) {
      const bestMoveArrow = [
        bestMove.slice(0, 2),
        bestMove.slice(2, 4),
        moveClassificationColors[MoveClassification.Best],
      ] as Arrow;

      return [bestMoveArrow];
    }

    return [];
  }, [position, showBestMoveArrow]);

  return (
    <Grid
      item
      container
      justifyContent="center"
      alignItems="center"
      wrap="nowrap"
      width={boardSize}
    >
      <EvaluationBar height={boardRef?.current?.offsetHeight || boardSize} />

      <Grid
        item
        container
        rowGap={1}
        justifyContent="center"
        alignItems="center"
        paddingLeft={2}
        xs
      >
        <PlayerInfo color={boardOrientation ? "black" : "white"} />

        <Grid
          item
          container
          justifyContent="center"
          alignItems="center"
          ref={boardRef}
          xs={12}
        >
          <Chessboard
            id="AnalysisBoard"
            position={boardFen}
            onPieceDrop={onPieceDrop}
            boardOrientation={boardOrientation ? "white" : "black"}
            customArrows={customArrows}
            customBoardStyle={{
              borderRadius: "5px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
            }}
            customSquare={SquareRenderer}
            onSquareClick={handleSquareLeftClick}
            onSquareRightClick={handleSquareRightClick}
            onPieceDragBegin={handlePieceDragBegin}
            onPieceDragEnd={handlePieceDragEnd}
          />
        </Grid>

        <PlayerInfo color={boardOrientation ? "white" : "black"} />
      </Grid>
    </Grid>
  );
}
