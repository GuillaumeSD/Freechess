import { ChessComGame } from "@/types/chessCom";
import { getPaddedNumber } from "./helpers";

export const getChessComUserRecentGames = async (
  username: string,
  signal?: AbortSignal
): Promise<ChessComGame[]> => {
  const date = new Date();
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const paddedMonth = getPaddedNumber(month);

  const res = await fetch(
    `https://api.chess.com/pub/player/${username}/games/${year}/${paddedMonth}`,
    { method: "GET", signal }
  );

  if (res.status >= 400) {
    throw new Error("Error fetching games from Chess.com");
  }

  const data = await res.json();

  const games: ChessComGame[] = data?.games ?? [];

  if (games.length < 50) {
    const previousMonth = month === 1 ? 12 : month - 1;
    const previousPaddedMonth = getPaddedNumber(previousMonth);
    const yearToFetch = previousMonth === 12 ? year - 1 : year;

    const resPreviousMonth = await fetch(
      `https://api.chess.com/pub/player/${username}/games/${yearToFetch}/${previousPaddedMonth}`
    );

    const dataPreviousMonth = await resPreviousMonth.json();

    games.push(...(dataPreviousMonth?.games ?? []));
  }

  const gamesToReturn = games
    .sort((a, b) => b.end_time - a.end_time)
    .slice(0, 50);

  return gamesToReturn;
};

export const getChessComUserAvatar = async (
  username: string
): Promise<string | null> => {
  const usernameParam = encodeURIComponent(username.trim().toLowerCase());

  const res = await fetch(`https://api.chess.com/pub/player/${usernameParam}`);
  const data = await res.json();
  const avatarUrl = data?.avatar;

  return typeof avatarUrl === "string" ? avatarUrl : null;
};
