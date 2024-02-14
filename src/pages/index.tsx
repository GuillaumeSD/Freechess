import TopBar from "@/sections/index/topBar";
import Board from "@/sections/index/board";
import ReviewPanelBody from "@/sections/index/reviewPanelBody";
import ReviewPanelToolBar from "@/sections/index/reviewPanelToolbar";

export default function HomePage() {
  return (
    <>
      <TopBar />

      <div className="center">
        <div id="review-container">
          <Board />

          <div id="review-panel">
            <ReviewPanelBody />

            <ReviewPanelToolBar />
          </div>
        </div>
      </div>
    </>
  );
}
