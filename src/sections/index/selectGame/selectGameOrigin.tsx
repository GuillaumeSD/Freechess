import { useState } from "react";
import InputGame from "./inputGame";
import SelectGameAccount from "./selectGameAccount";
import { GameOrigin } from "@/types/enums";

export default function SelectGameOrigin() {
  const [gameOrigin, setGameOrigin] = useState(GameOrigin.Pgn);

  return (
    <>
      <div id="load-type-dropdown-container" className="white">
        <span style={{ marginRight: "0.3rem" }}>Load game from</span>
        <select
          id="load-type-dropdown"
          value={gameOrigin}
          onChange={(e) => setGameOrigin(e.target.value as GameOrigin)}
        >
          {Object.values(GameOrigin).map((origin) => (
            <option key={origin} value={origin}>
              {gameOriginLabel[origin]}
            </option>
          ))}
        </select>
      </div>

      {renderSelectGameInfo(gameOrigin)}
    </>
  );
}

const gameOriginLabel: Record<GameOrigin, string> = {
  [GameOrigin.Pgn]: "PGN",
  [GameOrigin.ChessCom]: "Chess.com",
  [GameOrigin.Lichess]: "Lichess",
  [GameOrigin.Json]: "JSON",
};

const renderSelectGameInfo = (gameOrigin: GameOrigin) => {
  switch (gameOrigin) {
    case GameOrigin.Pgn:
      return (
        <InputGame gameOrigin={gameOrigin} placeholder="Enter PGN here..." />
      );
    case GameOrigin.Json:
      return (
        <InputGame gameOrigin={gameOrigin} placeholder="Enter JSON here..." />
      );
    default:
      return <SelectGameAccount gameOrigin={gameOrigin} />;
  }
};
