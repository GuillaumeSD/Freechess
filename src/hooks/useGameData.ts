import { CurrentPosition } from "@/types/eval";
import { Chess } from "chess.js";
import { PrimitiveAtom, useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";

export const useGameData = (
  gameAtom: PrimitiveAtom<Chess>,
  gameDataAtom: PrimitiveAtom<CurrentPosition>
) => {
  const game = useAtomValue(gameAtom);
  const [gameData, setGameData] = useAtom(gameDataAtom);

  useEffect(() => {
    const history = game.history({ verbose: true });
    const lastMove = history.at(-1);
    setGameData({ lastMove });
  }, [game]); // eslint-disable-line react-hooks/exhaustive-deps

  return gameData;
};
