import { Move } from "chess.js";
import { getWhoIsCheckmated, isCheck } from "./chess";

let audio: HTMLAudioElement | null = null;

const playSound = async (url: string) => {
  if (!audio) audio = new Audio();

  const isPlaying = !audio.paused && !audio.ended;
  if (isPlaying) return;

  audio.src = url;
  await audio.play();
};

export const playCaptureSound = () => playSound("/sounds/capture.webm");
export const playCastleSound = () => playSound("/sounds/castle.webm");
export const playGameEndSound = () => playSound("/sounds/game-end.webm");
export const playGameStartSound = () => playSound("/sounds/game-start.webm");
export const playIllegalMoveSound = () =>
  playSound("/sounds/illegal-move.webm");
export const playMoveCheckSound = () => playSound("/sounds/move-check.webm");
export const playMoveSound = () => playSound("/sounds/move.webm");
export const playPromoteSound = () => playSound("/sounds/promote.webm");

export const playSoundFromMove = async (move: Move | null) => {
  if (!move) {
    playIllegalMoveSound();
  } else if (getWhoIsCheckmated(move.after)) {
    playGameEndSound();
  } else if (isCheck(move.after)) {
    playMoveCheckSound();
  } else if (move.promotion) {
    playPromoteSound();
  } else if (move.captured) {
    playCaptureSound();
  } else if (move.flags.includes("k") || move.flags.includes("q")) {
    playCastleSound();
  } else {
    playMoveSound();
  }
};
