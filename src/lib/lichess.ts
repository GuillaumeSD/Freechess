import { LineEval, MoveEval } from "@/types/eval";
import { sortLines } from "./engine/helpers/parseResults";
import {
  LichessError,
  LichessEvalBody,
  LichessResponse,
} from "@/types/lichess";

export const getLichessEval = async (
  fen: string,
  multiPv = 1
): Promise<MoveEval> => {
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

    return {
      bestMove: lines[0].pv[0],
      lines: lines.slice(0, multiPv),
    };
  } catch (error) {
    console.error(error);
    return {
      bestMove: "",
      lines: [],
    };
  }
};
