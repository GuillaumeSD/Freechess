import { Chess } from "chess.js";
import { PrimitiveAtom, useAtomValue } from "jotai";
import { useGameDatabase } from "./useGameDatabase";

export const usePlayersNames = (gameAtom: PrimitiveAtom<Chess>) => {
  const game = useAtomValue(gameAtom);
  const { gameFromUrl } = useGameDatabase();
  const headers = game.getHeaders();

  const whiteName = gameFromUrl?.white?.name || headers.White || "White";
  const blackName = gameFromUrl?.black?.name || headers.Black || "Black";

  const whiteElo = gameFromUrl?.white?.rating || headers.WhiteElo || undefined;
  const blackElo = gameFromUrl?.black?.rating || headers.BlackElo || undefined;

  return {
    whiteName,
    blackName,
    whiteElo,
    blackElo,
  };
};
