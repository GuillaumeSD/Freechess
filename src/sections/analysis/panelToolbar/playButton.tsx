import { Icon } from "@iconify/react";
import { Grid2 as Grid, IconButton, Tooltip } from "@mui/material";
import { useAtomValue } from "jotai";
import { boardAtom, gameAtom } from "../states";
import { useChessActions } from "@/hooks/useChessActions";
import { useCallback, useEffect, useRef, useState } from "react";

const PLAY_SPEED = 1000; // 1 second between moves

export default function PlayButton() {
  const { playMove: playBoardMove } = useChessActions(boardAtom);
  const game = useAtomValue(gameAtom);
  const board = useAtomValue(boardAtom);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const gameHistory = game.history();
  const boardHistory = board.history();
  
  const isButtonEnabled =
    boardHistory.length < gameHistory.length &&
    gameHistory.slice(0, boardHistory.length).join() === boardHistory.join();

  const playNextMove = useCallback(() => {
    if (!isButtonEnabled) {
      setIsPlaying(false);
      return;
    }

    const nextMoveIndex = boardHistory.length;
    const nextMove = game.history({ verbose: true })[nextMoveIndex];
    const comment = game
      .getComments()
      .find((c) => c.fen === nextMove.after)?.comment;

    if (nextMove) {
      playBoardMove({
        from: nextMove.from,
        to: nextMove.to,
        promotion: nextMove.promotion,
        comment,
      });
    }
  }, [isButtonEnabled, boardHistory, game, playBoardMove]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } else {
      setIsPlaying(true);
      intervalRef.current = setInterval(playNextMove, PLAY_SPEED);
    }
  }, [isPlaying, playNextMove]);

  // Cleanup interval on unmount or when playing stops
  useEffect(() => {
    if (!isPlaying && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying]);

  // Spacebar shortcut
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        if (isButtonEnabled || isPlaying) {
          togglePlay();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [togglePlay, isButtonEnabled, isPlaying]);

  return (
    <Tooltip title={isPlaying ? "Pause auto-play" : "Auto-play moves"}>
      <Grid>
        <IconButton
          onClick={togglePlay}
          disabled={!isButtonEnabled && !isPlaying}
          sx={{ 
            paddingX: 1.2, 
            paddingY: 0.5,
            color: isPlaying ? "primary.main" : "inherit"
          }}
        >
          <Icon 
            icon={isPlaying ? "ri:pause-line" : "ri:play-line"} 
            height={24} 
          />
        </IconButton>
      </Grid>
    </Tooltip>
  );
} 