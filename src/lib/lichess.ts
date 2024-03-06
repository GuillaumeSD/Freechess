import { LineEval, PositionEval } from "@/types/eval";
import { sortLines } from "./engine/helpers/parseResults";
import {
  LichessError,
  LichessEvalBody,
  LichessResponse,
} from "@/types/lichess";

export const getLichessEval = async (
  fen: string,
  multiPv = 1
): Promise<PositionEval> => {
  try {
    const res = await fetch(
      `https://lichess.org/api/cloud-eval?fen=${fen}&multiPv=${multiPv}`
    );

    const data: LichessResponse<LichessEvalBody> = await res.json();

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

    const bestMove = lines[0].pv[0];
    const linesToKeep = lines.slice(0, multiPv);

    const isWhiteToPlay = fen.split(" ")[1] === "w";

    if (!isWhiteToPlay) {
      return {
        bestMove,
        lines: linesToKeep.map((line) => ({
          ...line,
          cp: line.cp ? -line.cp : line.cp,
          mate: line.mate ? -line.mate : line.mate,
        })),
      };
    }

    return {
      bestMove,
      lines: linesToKeep,
    };
  } catch (error) {
    console.error(error);
    return {
      bestMove: "",
      lines: [],
    };
  }
};
