import { Chess, Move } from "chess.js";
import { PrimitiveAtom, useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";

export interface GameData {
  history: Move[];
  lastMove: Move | undefined;
}

export const useGameData = (
  gameAtom: PrimitiveAtom<Chess>,
  gameDataAtom: PrimitiveAtom<GameData>
) => {
  const game = useAtomValue(gameAtom);
  const [gameData, setGameData] = useAtom(gameDataAtom);

  useEffect(() => {
    const history = game.history({ verbose: true });
    const lastMove = history.at(-1);
    setGameData({ history, lastMove });
  }, [game]); // eslint-disable-line react-hooks/exhaustive-deps

  return gameData;
};
