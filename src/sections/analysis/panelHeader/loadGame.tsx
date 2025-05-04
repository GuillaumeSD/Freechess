import LoadGameButton from "../../loadGame/loadGameButton";
import { useCallback, useEffect } from "react";
import { useChessActions } from "@/hooks/useChessActions";
import {
  boardAtom,
  boardOrientationAtom,
  evaluationProgressAtom,
  gameAtom,
  gameEvalAtom,
} from "../states";
import { useGameDatabase } from "@/hooks/useGameDatabase";
import { useAtomValue, useSetAtom } from "jotai";
import { Chess } from "chess.js";
import { useRouter } from "next/router";
import { getStartingFen } from "@/lib/chess";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function LoadGame() {
  const router = useRouter();
  const game = useAtomValue(gameAtom);
  const { setPgn: setGamePgn } = useChessActions(gameAtom);
  const { reset: resetBoard } = useChessActions(boardAtom);
  const { gameFromUrl } = useGameDatabase();
  const setEval = useSetAtom(gameEvalAtom);
  const setBoardOrientation = useSetAtom(boardOrientationAtom);
  const evaluationProgress = useAtomValue(evaluationProgressAtom);

  // Retrieve stored usernames for Chess.com and Lichess (ensure non-null strings)
  const [chessComUsernameRaw] = useLocalStorage("chesscom-username", "");
  const [lichessUsernameRaw] = useLocalStorage("lichess-username", "");
  const chessComUsername = chessComUsernameRaw ?? "";
  const lichessUsername = lichessUsernameRaw ?? "";

  const resetAndSetGamePgn = useCallback(
    (pgn: string) => {
      resetBoard({ fen: getStartingFen({ pgn }) });
      setEval(undefined);

      // Determine board orientation so that the user is always at the bottom
      let orientation = true;
      try {
        const tmp = new Chess();
        tmp.loadPgn(pgn);
        const headers = tmp.getHeaders();
        const whiteHeader = headers.White?.toLowerCase() || "";
        const blackHeader = headers.Black?.toLowerCase() || "";

        const userChess = chessComUsername.toLowerCase();
        const userLichess = lichessUsername.toLowerCase();

        if (userChess) {
          if (whiteHeader === userChess) orientation = true;
          else if (blackHeader === userChess) orientation = false;
        } else if (userLichess) {
          if (whiteHeader === userLichess) orientation = true;
          else if (blackHeader === userLichess) orientation = false;
        }
      } catch (error) {
        console.error("Error determining board orientation", error);
      }
      setBoardOrientation(orientation);

      setGamePgn(pgn);
    },
    [
      resetBoard,
      setGamePgn,
      setEval,
      setBoardOrientation,
      chessComUsername,
      lichessUsername,
    ]
  );

  useEffect(() => {
    const loadGame = async () => {
      if (!gameFromUrl) return;

      const gamefromDbChess = new Chess();
      gamefromDbChess.loadPgn(gameFromUrl.pgn);
      if (game.history().join() === gamefromDbChess.history().join()) return;

      resetAndSetGamePgn(gameFromUrl.pgn);
      setEval(gameFromUrl.eval);
    };

    loadGame();
  }, [gameFromUrl, game, resetAndSetGamePgn, setEval]);

  const isGameLoaded =
    gameFromUrl !== undefined ||
    (!!game.getHeaders().White && game.getHeaders().White !== "?") ||
    game.history().length > 0;

  if (evaluationProgress) return null;

  return (
    <LoadGameButton
      label={isGameLoaded ? "Load another game" : "Load game"}
      size="small"
      setGame={async (game) => {
        await router.push("/");
        resetAndSetGamePgn(game.pgn());
      }}
    />
  );
}
