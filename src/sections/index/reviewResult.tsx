export default function ReviewResult() {
  return (
    <div id="report-cards">
      <h2 id="accuracies-title" className="white">
        Accuracies
      </h2>
      <div id="accuracies">
        <b id="white-accuracy">0%</b>
        <b id="black-accuracy">0%</b>
      </div>

      <div id="classification-message-container">
        <img id="classification-icon" src="book.png" height="25" />
        <b id="classification-message" />
      </div>

      <b id="top-alternative-message">Qxf2+ was best</b>

      <div id="engine-suggestions">
        <h2 id="engine-suggestions-title" className="white">
          Engine
        </h2>
      </div>

      <span id="opening-name" className="white" />
    </div>
  );
}
