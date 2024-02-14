import { drawBoard } from "@/lib/board";
import { drawEvaluationBar } from "@/lib/evalBar";
import { useEffect, useRef } from "react";

export default function Board() {
  const boardRef = useRef<HTMLCanvasElement>(null);
  const evalBarRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = boardRef.current?.getContext("2d");
    if (!ctx) return;

    drawBoard(ctx);

    const evalCtx = evalBarRef.current?.getContext("2d");
    if (!evalCtx) return;
    drawEvaluationBar(evalCtx);
  }, []);

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
