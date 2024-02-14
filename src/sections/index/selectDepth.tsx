export default function SelectDepth() {
  return (
    <>
      <b className="white">⚙️ Search depth</b>
      <div id="depth-slider-container">
        <input
          id="depth-slider"
          type="range"
          min="14"
          max="20"
          defaultValue="16"
        />
        <span id="depth-counter" className="white">
          16 🐇
        </span>
      </div>
      <h6 id="depth-message" className="white">
        Lower depths recommended for slower devices.
      </h6>
    </>
  );
}
