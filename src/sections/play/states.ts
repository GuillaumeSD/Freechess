import { Color, EngineName } from "@/types/enums";
import { CurrentPosition } from "@/types/eval";
import { Chess } from "chess.js";
import { atom } from "jotai";

export const gameAtom = atom(new Chess());
export const gameDataAtom = atom<CurrentPosition>({});
export const playerColorAtom = atom<Color>(Color.White);
export const enginePlayNameAtom = atom<EngineName>(EngineName.Stockfish16);
export const engineSkillLevelAtom = atom<number>(1);
export const isGameInProgressAtom = atom(false);
