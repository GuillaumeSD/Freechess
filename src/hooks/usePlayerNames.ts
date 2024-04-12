import { Chess } from "chess.js";
import { PrimitiveAtom, useAtomValue } from "jotai";
import { useGameDatabase } from "./useGameDatabase";

export const usePlayersNames = (gameAtom: PrimitiveAtom<Chess>) => {
  const game = useAtomValue(gameAtom);
  const { gameFromUrl } = useGameDatabase();

  const whiteName =
    gameFromUrl?.white?.name || game.header()["White"] || "White";
  const blackName =
    gameFromUrl?.black?.name || game.header()["Black"] || "Black";

  const whiteElo =
    gameFromUrl?.white?.rating || game.header()["WhiteElo"] || undefined;

  const blackElo =
    gameFromUrl?.black?.rating || game.header()["BlackElo"] || undefined;

  return {
    whiteName,
    blackName,
    whiteElo,
    blackElo,
  };
};
