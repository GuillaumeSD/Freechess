import { GameEval } from "@/types/game";
import { Chess } from "chess.js";
import { atom } from "jotai";

export const gameEvalAtom = atom<GameEval | undefined>(undefined);
export const gameAtom = atom(new Chess());
export const boardAtom = atom(new Chess());
