import { Move } from "chess.js";
import { getWhoIsCheckmated, isCheck } from "./chess";

let ctx: AudioContext | null = null;
const bufferCache = new Map<string, AudioBuffer>();

const urls = {
  move: "/sounds/move.webm",
  capture: "/sounds/capture.webm",
  castle: "/sounds/castle.webm",
  check: "/sounds/move-check.webm",
  promote: "/sounds/promote.webm",
  gameEnd: "/sounds/game-end.webm",
  gameStart: "/sounds/game-start.webm",
  illegal: "/sounds/illegal-move.webm"
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
export const playCastleSound = () => play("castle");
export const playGameEndSound = () => play("gameEnd");
export const playGameStartSound = () => play("gameStart");
export const playIllegalMoveSound = () => play("illegal");
export const playMoveCheckSound = () => play("check");
export const playMoveSound = () => play("move");
export const playPromoteSound = () => play("promote");

export async function playSoundFromMove(move: Move | null) {
  if (!move) return playIllegalMoveSound();
  if (getWhoIsCheckmated(move.after)) return playGameEndSound();
  if (isCheck(move.after)) return playMoveCheckSound();
  if (move.promotion) return playPromoteSound();
  if (move.captured) return playCaptureSound();
  if (move.isKingsideCastle() || move.isQueensideCastle()) return playCastleSound();
  return playMoveSound();
}
