import { Box, Grid2 as Grid } from "@mui/material";
import { PrimitiveAtom, atom, useAtomValue, useSetAtom } from "jotai";
import {
  Arrow,
  CustomPieces,
  CustomSquareRenderer,
  Piece,
  PromotionPieceOption,
  Square,
} from "react-chessboard/dist/chessboard/types";
import { useChessActions } from "@/hooks/useChessActions";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Color, MoveClassification } from "@/types/enums";
import { Chess } from "chess.js";
import { getSquareRenderer } from "./squareRenderer";
import { CurrentPosition } from "@/types/eval";
import EvaluationBar from "./evaluationBar";
import { CLASSIFICATION_COLORS } from "@/constants";
import { Player } from "@/types/game";
import PlayerHeader from "./playerHeader";
import { boardHueAtom, pieceSetAtom } from "./states";
import tinycolor from "tinycolor2";
import Chessground from "./chessground";
import { Config } from "@lichess-org/chessground/config";
import { Key, MoveMetadata } from "@lichess-org/chessground/types";

export interface Props {
  id: string;
  canPlay?: Color | boolean;
  gameAtom: PrimitiveAtom<Chess>;
  boardSize?: number;
  whitePlayer: Player;
  blackPlayer: Player;
  boardOrientation?: Color;
  currentPositionAtom?: PrimitiveAtom<CurrentPosition>;
  showBestMoveArrow?: boolean;
  showPlayerMoveIconAtom?: PrimitiveAtom<boolean>;
  showEvaluationBar?: boolean;
}

export default function Board({
  id: boardId,
  canPlay,
  gameAtom,
  boardSize,
  whitePlayer,
  blackPlayer,
  boardOrientation = Color.White,
  currentPositionAtom = atom({}),
  showBestMoveArrow = false,
  showPlayerMoveIconAtom,
  showEvaluationBar = false,
}: Props) {
  const boardRef = useRef<HTMLDivElement>(null);
  const game = useAtomValue(gameAtom);
  const { playMove } = useChessActions(gameAtom);
  const clickedSquaresAtom = useMemo(() => atom<Square[]>([]), []);
  const setClickedSquares = useSetAtom(clickedSquaresAtom);
  const playableSquaresAtom = useMemo(() => atom<Square[]>([]), []);
  const setPlayableSquares = useSetAtom(playableSquaresAtom);
  const position = useAtomValue(currentPositionAtom);
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [moveClickFrom, setMoveClickFrom] = useState<Square | null>(null);
  const [moveClickTo, setMoveClickTo] = useState<Square | null>(null);
  const pieceSet = useAtomValue(pieceSetAtom);
  const boardHue = useAtomValue(boardHueAtom);

  const gameFen = game.fen();

  useEffect(() => {
    setClickedSquares([]);
  }, [gameFen, setClickedSquares]);

  const isPiecePlayable = useCallback(
    ({ piece }: { piece: string }): boolean => {
      if (game.isGameOver() || !canPlay) return false;
      if (canPlay === true || canPlay === piece[0]) return true;
      return false;
    },
    [canPlay, game]
  );

  const onPieceDrop = useCallback(
    (source: Square, target: Square, piece: string): boolean => {
      if (!isPiecePlayable({ piece })) return false;

      const result = playMove({
        from: source,
        to: target,
        promotion: piece[1]?.toLowerCase() ?? "q",
      });

      return !!result;
    },
    [isPiecePlayable, playMove]
  );

  const resetMoveClick = useCallback(
    (square?: Square | null) => {
      setMoveClickFrom(square ?? null);
      setMoveClickTo(null);
      setShowPromotionDialog(false);
      if (square) {
        const moves = game.moves({ square, verbose: true });
        setPlayableSquares(moves.map((m) => m.to));
      } else {
        setPlayableSquares([]);
      }
    },
    [setMoveClickFrom, setMoveClickTo, setPlayableSquares, game]
  );

  const handleSquareLeftClick = useCallback(
    (square: Square, piece?: string) => {
      setClickedSquares([]);

      if (!moveClickFrom) {
        if (piece && !isPiecePlayable({ piece })) return;
        resetMoveClick(square);
        return;
      }

      const validMoves = game.moves({ square: moveClickFrom, verbose: true });
      const move = validMoves.find((m) => m.to === square);

      if (!move) {
        resetMoveClick(square);
        return;
      }

      setMoveClickTo(square);

      if (
        move.piece === "p" &&
        ((move.color === "w" && square[1] === "8") ||
          (move.color === "b" && square[1] === "1"))
      ) {
        setShowPromotionDialog(true);
        return;
      }

      const result = playMove({
        from: moveClickFrom,
        to: square,
      });

      resetMoveClick(result ? undefined : square);
    },
    [
      game,
      isPiecePlayable,
      moveClickFrom,
      playMove,
      resetMoveClick,
      setClickedSquares,
    ]
  );

  const handleSquareRightClick = useCallback(
    (square: Square) => {
      setClickedSquares((prev) =>
        prev.includes(square)
          ? prev.filter((s) => s !== square)
          : [...prev, square]
      );
    },
    [setClickedSquares]
  );

  const handlePieceDragBegin = useCallback(
    (_: string, square: Square) => {
      resetMoveClick(square);
    },
    [resetMoveClick]
  );

  const handlePieceDragEnd = useCallback(() => {
    resetMoveClick();
  }, [resetMoveClick]);

  const onPromotionPieceSelect = useCallback(
    (piece?: PromotionPieceOption, from?: Square, to?: Square) => {
      if (!piece) return false;
      const promotionPiece = piece[1]?.toLowerCase() ?? "q";

      if (moveClickFrom && moveClickTo) {
        const result = playMove({
          from: moveClickFrom,
          to: moveClickTo,
          promotion: promotionPiece,
        });
        resetMoveClick();
        return !!result;
      }

      if (from && to) {
        const result = playMove({
          from,
          to,
          promotion: promotionPiece,
        });
        resetMoveClick();
        return !!result;
      }

      resetMoveClick(moveClickFrom);
      return false;
    },
    [moveClickFrom, moveClickTo, playMove, resetMoveClick]
  );

  const customArrows: Arrow[] = useMemo(() => {
    const bestMove = position?.lastEval?.bestMove;
    const moveClassification = position?.eval?.moveClassification;

    if (
      bestMove &&
      showBestMoveArrow &&
      moveClassification !== MoveClassification.Best &&
      moveClassification !== MoveClassification.Opening &&
      moveClassification !== MoveClassification.Forced &&
      moveClassification !== MoveClassification.Perfect
    ) {
      const bestMoveArrow = [
        bestMove.slice(0, 2),
        bestMove.slice(2, 4),
        tinycolor(CLASSIFICATION_COLORS[MoveClassification.Best])
          .spin(-boardHue)
          .toHexString(),
      ] as Arrow;

      return [bestMoveArrow];
    }

    return [];
  }, [position, showBestMoveArrow, boardHue]);

  const SquareRenderer: CustomSquareRenderer = useMemo(() => {
    return getSquareRenderer({
      currentPositionAtom: currentPositionAtom,
      clickedSquaresAtom,
      playableSquaresAtom,
      showPlayerMoveIconAtom,
    });
  }, [
    currentPositionAtom,
    clickedSquaresAtom,
    playableSquaresAtom,
    showPlayerMoveIconAtom,
  ]);

  const customBoardStyle = useMemo(() => {
    const commonBoardStyle = {
      borderRadius: "5px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
    };

    if (boardHue) {
      return {
        ...commonBoardStyle,
        filter: `hue-rotate(${boardHue}deg)`,
      };
    }

    return commonBoardStyle;
  }, [boardHue]);

  const boardConfig = useMemo(
    () =>
      ({
        fen: gameFen,
        orientation: boardOrientation === Color.White ? "white" : "black",
        animation: { enabled: true, duration: 200 },
        movable: {
          color:
            canPlay === Color.White
              ? "white"
              : canPlay === Color.Black
                ? "black"
                : canPlay
                  ? "both"
                  : undefined,
          events: {
            after: (orig: Key, dest: Key, metadata: MoveMetadata) => {
              console.log(
                `Move from ${orig} to ${dest} with metadata:`,
                metadata
              );
            },
          },
        },
        premovable: { enabled: false },
      }) satisfies Config,
    [gameFen, boardOrientation, canPlay]
  );

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      wrap="nowrap"
      width={boardSize}
    >
      {showEvaluationBar && (
        <EvaluationBar
          height={boardRef?.current?.offsetHeight || boardSize || 400}
          boardOrientation={boardOrientation}
          currentPositionAtom={currentPositionAtom}
        />
      )}

      <Grid
        container
        rowGap={1.5}
        justifyContent="center"
        alignItems="center"
        paddingLeft={showEvaluationBar ? 2 : 0}
        size="grow"
      >
        <PlayerHeader
          color={boardOrientation === Color.White ? Color.Black : Color.White}
          gameAtom={gameAtom}
          player={boardOrientation === Color.White ? blackPlayer : whitePlayer}
        />

        <Grid
          container
          justifyContent="center"
          alignItems="center"
          height={boardRef?.current?.offsetWidth}
          ref={boardRef}
          width="round(down, 100%, 8px)"
        >
          <Chessground config={boardConfig} pieceSet={pieceSet} />
          {/* {<Chessboard
            id={`${boardId}-${canPlay}`}
            position={gameFen}
            onPieceDrop={onPieceDrop}
            boardOrientation={
              boardOrientation === Color.White ? "white" : "black"
            }
            customBoardStyle={customBoardStyle}
            customArrows={customArrows}
            isDraggablePiece={isPiecePlayable}
            customSquare={SquareRenderer}
            onSquareClick={handleSquareLeftClick}
            onSquareRightClick={handleSquareRightClick}
            onPieceDragBegin={handlePieceDragBegin}
            onPieceDragEnd={handlePieceDragEnd}
            onPromotionPieceSelect={onPromotionPieceSelect}
            showPromotionDialog={showPromotionDialog}
            promotionToSquare={moveClickTo}
            animationDuration={200}
            customPieces={customPieces}
          />} */}
        </Grid>

        <PlayerHeader
          color={boardOrientation}
          gameAtom={gameAtom}
          player={boardOrientation === Color.White ? whitePlayer : blackPlayer}
        />
      </Grid>
    </Grid>
  );
}
