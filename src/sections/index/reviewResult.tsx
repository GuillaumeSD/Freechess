import { useAtomValue } from "jotai";
import { boardPgnAtom, gameEvalAtom } from "./index.state";
import { getNextMoveIndex } from "@/lib/chess";

export default function ReviewResult() {
  const boardPgn = useAtomValue(boardPgnAtom);
  const gameEval = useAtomValue(gameEvalAtom);
  if (!gameEval) return null;

  const evalIndex = getNextMoveIndex(boardPgn);
  const moveEval = gameEval.moves[evalIndex];

  return (
    <div id="report-cards">
      <h2 id="accuracies-title" className="white">
        Accuracies
      </h2>
      <div id="accuracies">
        <b id="white-accuracy">{gameEval.whiteAccuracy}%</b>
        <b id="black-accuracy">{gameEval.blackAccuracy}%</b>
      </div>

      <div id="classification-message-container">
        <img id="classification-icon" src="book.png" height="25" />
        <b id="classification-message" />
      </div>

      <b id="top-alternative-message">
        {moveEval ? `${moveEval.bestMove} is best` : "Game is over"}
      </b>

      <div id="engine-suggestions">
        <h2 id="engine-suggestions-title" className="white">
          Engine
        </h2>
        {moveEval?.lines.map((line) => (
          <div key={line.pv[0]} style={{ color: "white" }}>
            <span style={{ marginRight: "2em" }}>
              {line.cp ? line.cp / 100 : `Mate in ${line.mate}`}
            </span>
            <span>{line.pv.slice(0, 7).join(", ")}</span>
          </div>
        ))}
      </div>

      <span id="opening-name" className="white" />
    </div>
  );
}
