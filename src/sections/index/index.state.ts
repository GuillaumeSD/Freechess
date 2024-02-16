import { GameEval } from "@/types/eval";
import { atom } from "jotai";

export const gameReviewAtom = atom<GameEval | undefined>(undefined);
