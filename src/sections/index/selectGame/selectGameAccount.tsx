import { GameOrigin } from "@/types/enums";

interface Props {
  gameOrigin: GameOrigin;
}

export default function SelectGameAccount({}: Props) {
  return (
    <div id="chess-site-username-container">
      <textarea
        id="chess-site-username"
        className="white"
        spellCheck="false"
        maxLength={48}
        placeholder="Username..."
      />
      <button id="fetch-account-games-button" className="std-btn success-btn">
        <img src="next.png" alt=">" height="25" />
      </button>
    </div>
  );
}
