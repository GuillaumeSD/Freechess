import { Move } from "chess.js";
import { getWhoIsCheckmated, isCheck } from "./chess";

let ctx: AudioContext | null = null;
const bufferCache = new Map<string, AudioBuffer>();

const urls = {
  move: "/sounds/move.mp3",
  capture: "/sounds/capture.mp3",
  illegal: "/sounds/illegal-move.mp3"
} as const;
type Sound = keyof typeof urls;

async function play(sound: Sound) {
  try {
    ctx ??= new (window.AudioContext || (window as any).webkitAudioContext)();
    if (ctx.state === "suspended") await ctx.resume();
    let buf = bufferCache.get(urls[sound]);
    if (!buf) {
      const res = await fetch(urls[sound]);
      buf = await ctx.decodeAudioData(await res.arrayBuffer());
      bufferCache.set(urls[sound], buf);
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start();
  } catch {
    if ("vibrate" in navigator) navigator.vibrate(50);
  }
}

export const playCaptureSound = () => play("capture");
export const playIllegalMoveSound = () => play("illegal");
export const playMoveSound = () => play("move");

export async function playSoundFromMove(move: Move | null) {
  if (!move) return playIllegalMoveSound();
  if (move.captured) return playCaptureSound();
  return playMoveSound();
}