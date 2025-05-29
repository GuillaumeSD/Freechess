import { Move } from "chess.js";

let audioContext: AudioContext | null = null;
let audio: HTMLAudioElement | null = null;

const playSound = async (url: string) => {
  if (!audio) {
    audioContext = new AudioContext();
    audio = new Audio();
    const source = audioContext.createMediaElementSource(audio);
    source.connect(audioContext.destination);
  }

  audio.src = url;
  try {
    await audio.play();
  } catch {
    console.warn("Audio play failed");
  }
};

export const playCaptureSound = () => playSound("/sounds/capture.mp3");
export const playIllegalMoveSound = () => playSound("/sounds/error.mp3");
export const playMoveSound = () => playSound("/sounds/move.mp3");

export const playSoundFromMove = async (move: Move | null) => {
  if (!move) {
    playIllegalMoveSound();
  } else if (move.captured) {
    playCaptureSound();
  } else {
    playMoveSound();
  }
};
