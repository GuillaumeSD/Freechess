import { LineEval, PositionEval } from "@/types/eval";
import { sortLines } from "./engine/helpers/parseResults";
import {
  LichessError,
  LichessEvalBody,
  LichessGame,
  LichessResponse,
} from "@/types/lichess";
import { logErrorToSentry } from "./sentry";

export const getLichessEval = async (
  fen: string,
  multiPv = 1
): Promise<PositionEval> => {
  try {
    const data = await fetchLichessEval(fen, multiPv);

    if ("error" in data) {
      if (data.error === LichessError.NotFound) {
        return {
          bestMove: "",
          lines: [],
        };
      }
      throw new Error(data.error);
    }

    const lines: LineEval[] = data.pvs.map((pv, index) => ({
      pv: pv.moves.split(" "),
      cp: pv.cp,
      mate: pv.mate,
      depth: data.depth,
      multiPv: index + 1,
    }));

    lines.sort(sortLines);
    const isWhiteToPlay = fen.split(" ")[1] === "w";
    if (!isWhiteToPlay) lines.reverse();

    const bestMove = lines[0].pv[0];
    const linesToKeep = lines.slice(0, multiPv);

    return {
      bestMove,
      lines: linesToKeep,
    };
  } catch (error) {
    logErrorToSentry(error, { fen, multiPv });

    return {
      bestMove: "",
      lines: [],
    };
  }
};

export const getLichessUserRecentGames = async (
  username: string
): Promise<LichessGame[]> => {
  const res = await fetch(
    `https://lichess.org/api/games/user/${username}?until=${Date.now()}&max=50&pgnInJson=true&sort=dateDesc`,
    { method: "GET", headers: { accept: "application/x-ndjson" } }
  );

  if (res.status === 404) return [];

  const rawData = await res.text();
  const games: LichessGame[] = rawData
    .split("\n")
    .filter((game) => game.length > 0)
    .map((game) => JSON.parse(game));

  return games;
};

const fetchLichessEval = async (
  fen: string,
  multiPv: number
): Promise<LichessResponse<LichessEvalBody>> => {
  try {
    const res = await fetch(
      `https://lichess.org/api/cloud-eval?fen=${fen}&multiPv=${multiPv}`,
      { method: "GET", signal: AbortSignal.timeout(200) }
    );

    return res.json();
  } catch (error) {
    console.error(error);

    return { error: LichessError.NotFound };
  }
};
