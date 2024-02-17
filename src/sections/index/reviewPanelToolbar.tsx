import { useAtom, useAtomValue } from "jotai";
import { boardPgnAtom, gamePgnAtom } from "./index.state";
import { addNextMove, initPgn, undoLastMove } from "@/lib/chess";

export default function ReviewPanelToolBar() {
  const [boardPgn, setBoardPgn] = useAtom(boardPgnAtom);
  const gamePgn = useAtomValue(gamePgnAtom);

  return (
    <div id="review-panel-toolbar">
      <div id="review-panel-toolbar-buttons" className="center">
        <img
          id="flip-board-button"
          src="flip.png"
          alt="Flip Board"
          title="Flip board"
        />
        <img
          id="back-start-move-button"
          src="back_to_start.png"
          alt="Back to start"
          title="Back to start"
          onClick={() => setBoardPgn(initPgn)}
        />
        <img
          id="back-move-button"
          src="back.png"
          alt="Back"
          title="Back"
          onClick={() => {
            setBoardPgn(undoLastMove(boardPgn));
          }}
        />
        <img
          id="next-move-button"
          src="next.png"
          alt="Next"
          title="Next"
          onClick={() => {
            const nextBoardPgn = addNextMove(boardPgn, gamePgn);
            setBoardPgn(nextBoardPgn);
          }}
        />
        <img
          id="go-end-move-button"
          src="go_to_end.png"
          alt="Go to end"
          title="Go to end"
        />
        <img
          id="save-analysis-button"
          src="save.png"
          alt="Save analysis"
          title="Save analysis"
        />
      </div>

      <div className="white" style={{ marginBottom: "10px" }}>
        <input
          id="suggestion-arrows-setting"
          type="checkbox"
          style={{ marginRight: "0.4rem" }}
        />
        <span>Suggestion Arrows</span>
      </div>
    </div>
  );
}
