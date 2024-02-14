import ReviewResult from "./reviewResult";
import SelectDepth from "./selectDepth";
import SelectGameOrigin from "./selectGame/selectGameOrigin";

export default function ReviewPanelBody() {
  return (
    <div id="review-panel-main">
      <h1 id="review-panel-title" className="white">
        📑 Game Report
      </h1>

      <SelectGameOrigin />

      <button id="review-button" className="std-btn success-btn white">
        <img src="analysis_icon.png" height="25" />
        <b>Analyse</b>
      </button>

      <SelectDepth />

      {false && <progress id="evaluation-progress-bar" max="100" />}

      <b id="status-message" />

      <b id="secondary-message" className="white" />

      {false && <ReviewResult />}
    </div>
  );
}
