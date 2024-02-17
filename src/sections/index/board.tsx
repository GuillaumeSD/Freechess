import { drawBoard } from "@/lib/board";
import { drawEvaluationBar } from "@/lib/evalBar";
import { useAtomValue } from "jotai";
import { useEffect, useRef } from "react";
import { boardPgnAtom } from "./index.state";
import { getLastFen } from "@/lib/chess";

export default function Board() {
  const boardRef = useRef<HTMLCanvasElement>(null);
  const evalBarRef = useRef<HTMLCanvasElement>(null);
  const boardPgn = useAtomValue(boardPgnAtom);
  const boardFen = getLastFen(boardPgn);

  useEffect(() => {
    const ctx = boardRef.current?.getContext("2d");
    if (!ctx) return;

    drawBoard(ctx, boardFen);

    const evalCtx = evalBarRef.current?.getContext("2d");
    if (!evalCtx) return;
    drawEvaluationBar(evalCtx);
  }, [boardFen]);

  return (
    <div id="board-outer-container" className="center">
      <canvas id="evaluation-bar" width="30" height="720" ref={evalBarRef} />

      <div id="board-inner-container" className="center">
        <div id="top-player-profile" className="profile">
          Black Player (?)
        </div>

        <canvas id="board" width="720" height="720" ref={boardRef} />

        <div id="bottom-player-profile" className="profile">
          White Player (?)
        </div>
      </div>
    </div>
  );
}
