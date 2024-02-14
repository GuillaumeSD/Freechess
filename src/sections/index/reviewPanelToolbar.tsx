export default function ReviewPanelToolBar() {
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
        />
        <img id="back-move-button" src="back.png" alt="Back" title="Back" />
        <img id="next-move-button" src="next.png" alt="Next" title="Next" />
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
