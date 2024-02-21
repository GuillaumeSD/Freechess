import { GameOrigin } from "@/types/enums";
import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import InputGame from "./inputGame";
import { useState } from "react";

export default function SelectGameOrigin() {
  const [gameOrigin, setGameOrigin] = useState<GameOrigin>(GameOrigin.Pgn);

  return (
    <Grid
      item
      container
      xs={12}
      justifyContent="center"
      alignItems="center"
      rowGap={1}
    >
      <FormControl sx={{ m: 1, minWidth: 150 }}>
        <InputLabel id="game-origin-select-label">Game Origin</InputLabel>
        <Select
          labelId="game-origin-select-label"
          id="game-origin-select"
          label="Game Origin"
          autoWidth
          value={gameOrigin}
          onChange={(e) => setGameOrigin(e.target.value as GameOrigin)}
        >
          {Object.values(GameOrigin).map((origin) => (
            <MenuItem key={origin} value={origin}>
              {gameOriginLabel[origin]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <InputGame />
    </Grid>
  );
}

const gameOriginLabel: Record<GameOrigin, string> = {
  [GameOrigin.Pgn]: "PGN",
  [GameOrigin.ChessCom]: "Chess.com",
  [GameOrigin.Lichess]: "Lichess",
};
