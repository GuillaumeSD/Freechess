import { Move } from "chess.js";
import { getWhoIsCheckmated, isCheck } from "./chess";

let audioContext: AudioContext | null = null;

type SoundType = 'move' | 'capture' | 'castle' | 'check' | 'promote' | 'gameEnd' | 'gameStart' | 'illegal';

const soundUrls: Record<SoundType, string> = {
  move: "/sounds/move.webm",
  capture: "/sounds/capture.webm",
  castle: "/sounds/castle.webm",
  check: "/sounds/move-check.webm",
  promote: "/sounds/promote.webm",
  gameEnd: "/sounds/game-end.webm",
  gameStart: "/sounds/game-start.webm",
  illegal: "/sounds/illegal-move.webm"
};

const getAudioContext = (): AudioContext | null => {
  if (!audioContext) {
    try {
      // @ts-ignore - Support Safari
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioContext = new AudioContextClass();
      }
    } catch {
      return null;
    }
  }
  return audioContext;
};

const audioBufferCache = new Map<string, AudioBuffer>();

const playSound = async (soundType: SoundType) => {
  try {
    const ctx = getAudioContext();
    if (!ctx) {
      if ('vibrate' in navigator) navigator.vibrate(80);
      return;
    }
    if (ctx.state === 'suspended') await ctx.resume();
    const url = soundUrls[soundType];
    let audioBuffer = audioBufferCache.get(url);
    if (!audioBuffer) {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      audioBufferCache.set(url, audioBuffer);
    }
    const source = ctx.createBufferSource();
    source.connect(ctx.destination);
    source.buffer = audioBuffer;
    source.start(ctx.currentTime);
  } catch {
    if ('vibrate' in navigator) navigator.vibrate(50);
  }
};

export const playCaptureSound = () => playSound('capture');
export const playCastleSound = () => playSound('castle');
export const playGameEndSound = () => playSound('gameEnd');
export const playGameStartSound = () => playSound('gameStart');
export const playIllegalMoveSound = () => playSound('illegal');
export const playMoveCheckSound = () => playSound('check');
export const playMoveSound = () => playSound('move');
export const playPromoteSound = () => playSound('promote');

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
  } else if (move.isKingsideCastle() || move.isQueensideCastle()) {
    playCastleSound();
  } else {
    playMoveSound();
  }
};
