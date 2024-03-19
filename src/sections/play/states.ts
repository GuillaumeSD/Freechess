import { GameData } from "@/hooks/useGameData";
import { Color } from "@/types/enums";
import { Chess } from "chess.js";
import { atom } from "jotai";

export const gameAtom = atom(new Chess());
export const gameDataAtom = atom<GameData>({
  history: [],
  lastMove: undefined,
});
export const playerColorAtom = atom<Color>(Color.White);
export const engineSkillLevelAtom = atom<number>(1);
export const isGameInProgressAtom = atom(false);

export const clickedSquaresAtom = atom<string[]>([]);
export const playableSquaresAtom = atom<string[]>([]);
