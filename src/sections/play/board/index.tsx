import { Grid } from "@mui/material";
import { Chessboard } from "react-chessboard";
import { useAtomValue, useSetAtom } from "jotai";
import {
  clickedSquaresAtom,
  engineSkillLevelAtom,
  gameAtom,
  playableSquaresAtom,
  playerColorAtom,
  isGameInProgressAtom,
  gameDataAtom,
} from "../states";
import { Square } from "react-chessboard/dist/chessboard/types";
import { useChessActions } from "@/hooks/useChessActions";
import { useEffect, useMemo, useRef } from "react";
import PlayerInfo from "./playerInfo";
import { useScreenSize } from "@/hooks/useScreenSize";
import { Color, EngineName } from "@/types/enums";
import SquareRenderer from "./squareRenderer";
import { useEngine } from "@/hooks/useEngine";
import { uciMoveParams } from "@/lib/chess";
import { useGameData } from "@/hooks/useGameData";

export default function Board() {
  const boardRef = useRef<HTMLDivElement>(null);
  const screenSize = useScreenSize();
  const engine = useEngine(EngineName.Stockfish16);
  const game = useAtomValue(gameAtom);
  const playerColor = useAtomValue(playerColorAtom);
  const { makeMove: makeGameMove } = useChessActions(gameAtom);
  const setClickedSquares = useSetAtom(clickedSquaresAtom);
  const setPlayableSquares = useSetAtom(playableSquaresAtom);
  const engineSkillLevel = useAtomValue(engineSkillLevelAtom);
  const isGameInProgress = useAtomValue(isGameInProgressAtom);
  useGameData(gameAtom, gameDataAtom);

  const gameFen = game.fen();
  const isGameFinished = game.isGameOver();

  useEffect(() => {
    const playEngineMove = async () => {
      if (
        !engine?.isReady() ||
        game.turn() === playerColor ||
        isGameFinished ||
        !isGameInProgress
      ) {
        return;
      }
      const move = await engine.getEngineNextMove(
        gameFen,
        engineSkillLevel - 1
      );
      if (move) makeGameMove(uciMoveParams(move));
    };
    playEngineMove();

    return () => {
      engine?.stopSearch();
    };
  }, [gameFen, isGameInProgress]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setClickedSquares([]);
  }, [gameFen, setClickedSquares]);

  const onPieceDrop = (
    source: Square,
    target: Square,
    piece: string
  ): boolean => {
    if (!piece || piece[0] !== playerColor || !isGameInProgress) return false;

    const result = makeGameMove({
      from: source,
      to: target,
      promotion: piece[1]?.toLowerCase() ?? "q",
    });

    return !!result;
  };

  const isPieceDraggable = ({ piece }: { piece: string }): boolean => {
    if (!piece) return false;
    return playerColor === piece[0];
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
    const moves = game.moves({ square, verbose: true });
    setPlayableSquares(moves.map((m) => m.to));
  };

  const handlePieceDragEnd = () => {
    setPlayableSquares([]);
  };

  const boardSize = useMemo(() => {
    const width = screenSize.width;
    const height = screenSize.height;

    // 900 is the md layout breakpoint
    if (window?.innerWidth < 900) {
      return Math.min(width, height - 150);
    }

    return Math.min(width - 300, height * 0.85);
  }, [screenSize]);

  return (
    <Grid
      item
      container
      rowGap={1}
      justifyContent="center"
      alignItems="center"
      width={boardSize}
    >
      <PlayerInfo
        color={playerColor === Color.White ? Color.Black : Color.White}
      />

      <Grid
        item
        container
        justifyContent="center"
        alignItems="center"
        ref={boardRef}
        xs={12}
      >
        <Chessboard
          id="PlayBoard"
          position={gameFen}
          onPieceDrop={onPieceDrop}
          boardOrientation={playerColor === Color.White ? "white" : "black"}
          customBoardStyle={{
            borderRadius: "5px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
          }}
          isDraggablePiece={isPieceDraggable}
          customSquare={SquareRenderer}
          onSquareClick={handleSquareLeftClick}
          onSquareRightClick={handleSquareRightClick}
          onPieceDragBegin={handlePieceDragBegin}
          onPieceDragEnd={handlePieceDragEnd}
        />
      </Grid>

      <PlayerInfo color={playerColor} />
    </Grid>
  );
}
