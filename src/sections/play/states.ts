import { Color } from "@/types/enums";
import { Chess } from "chess.js";
import { atom } from "jotai";

export const gameAtom = atom(new Chess());
export const playerColorAtom = atom<Color>(Color.White);
export const engineSkillLevelAtom = atom<number>(1);
export const isGameInProgressAtom = atom(false);

export const clickedSquaresAtom = atom<string[]>([]);
export const playableSquaresAtom = atom<string[]>([]);
