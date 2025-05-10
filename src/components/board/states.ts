import { atomWithStorage } from "jotai/utils";

export const pieceSetAtom = atomWithStorage("pieceSet", "cburnett");
export const boardHueAtom = atomWithStorage("boardHue", 0);
