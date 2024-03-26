import { CurrentPosition, GameEval } from "@/types/eval";
import { Chess } from "chess.js";
import { atom } from "jotai";

export const gameEvalAtom = atom<GameEval | undefined>(undefined);
export const gameAtom = atom(new Chess());
export const boardAtom = atom(new Chess());
export const currentPositionAtom = atom<CurrentPosition>({});

export const boardOrientationAtom = atom(true);
export const showBestMoveArrowAtom = atom(true);
export const showPlayerMoveIconAtom = atom(true);

export const engineDepthAtom = atom(16);
export const engineMultiPvAtom = atom(3);
export const evaluationProgressAtom = atom(0);
