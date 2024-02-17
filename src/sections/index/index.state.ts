import { initPgn } from "@/lib/chess";
import { GameEval } from "@/types/eval";
import { atom } from "jotai";

export const gameEvalAtom = atom<GameEval | undefined>(undefined);
export const gamePgnAtom = atom(initPgn);
export const boardPgnAtom = atom(initPgn);
