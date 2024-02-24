import { LineEval } from "@/types/eval";
import { Game } from "@/types/game";
import { Chess } from "chess.js";

export const getFens = (game: Chess): string[] => {
  return game.history({ verbose: true }).map((move) => move.before);
};

export const getGameFromPgn = (pgn: string): Chess => {
  const game = new Chess();
  game.loadPgn(pgn);

  return game;
};

export const formatGameToDatabase = (game: Chess): Omit<Game, "id"> => {
  const headers: Record<string, string | undefined> = game.header();

  return {
    pgn: game.pgn(),
    event: headers.Event,
    site: headers.Site,
    date: headers.Date,
    round: headers.Round,
    white: {
      name: headers.White,
      rating: headers.WhiteElo ? Number(headers.WhiteElo) : undefined,
    },
    black: {
      name: headers.Black,
      rating: headers.BlackElo ? Number(headers.BlackElo) : undefined,
    },
    result: headers.Result,
    termination: headers.Termination,
    timeControl: headers.TimeControl,
  };
};

export const getGameToSave = (game: Chess, board: Chess): Chess => {
  if (game.history().length) return game;

  const headers = board.header();

  if (!headers.Event) {
    board.header("Event", "Freechess Game");
  }

  if (!headers.Site) {
    board.header("Site", "Freechess");
  }

  if (!headers.Date) {
    board.header(
      "Date",
      new Date().toISOString().split("T")[0].replaceAll("-", ".")
    );
  }

  return board;
};

export const moveLineUciToSan = (
  fen: string
): ((moveUci: string) => string) => {
  const game = new Chess(fen);

  return (moveUci: string): string => {
    try {
      const move = game.move({
        from: moveUci.slice(0, 2),
        to: moveUci.slice(2, 4),
        promotion: moveUci.slice(4, 5) || undefined,
      });

      return move.san;
    } catch (e) {
      return moveUci;
    }
  };
};

export const getEvaluationBarValue = (
  bestLine: LineEval,
  whiteToPlay: boolean
): { whiteBarPercentage: number; label: string } => {
  if (bestLine.mate) {
    return {
      whiteBarPercentage: whiteToPlay ? 100 : 0,
      label: `M${bestLine.mate}`,
    };
  }

  if (!bestLine.cp) {
    return { whiteBarPercentage: 50, label: "0.0" };
  }

  const cp = bestLine.cp;
  const whiteBarPercentage = Math.min(50 + cp / 20, 98);

  const label = (cp / 100).toFixed(1);

  if (label.toString().length > 3) {
    return { whiteBarPercentage, label: (cp / 100).toFixed(0) };
  }

  return { whiteBarPercentage, label: (cp / 100).toFixed(1) };
};
