import { Chess } from "chess.js";
import { PrimitiveAtom, useAtomValue } from "jotai";
import { useGameDatabase } from "./useGameDatabase";

export const usePlayersNames = (gameAtom: PrimitiveAtom<Chess>) => {
  const game = useAtomValue(gameAtom);
  const { gameFromUrl } = useGameDatabase();
  const headers = game.getHeaders();

  const headersWhiteName =
    headers.White && headers.White !== "?" ? headers.White : undefined;
  const headersBlackName =
    headers.Black && headers.Black !== "?" ? headers.Black : undefined;

  const whiteName = gameFromUrl?.white?.name || headersWhiteName || "White";
  const blackName = gameFromUrl?.black?.name || headersBlackName || "Black";

  const whiteElo = gameFromUrl?.white?.rating || headers.WhiteElo || undefined;
  const blackElo = gameFromUrl?.black?.rating || headers.BlackElo || undefined;

  return {
    whiteName,
    blackName,
    whiteElo,
    blackElo,
  };
};
