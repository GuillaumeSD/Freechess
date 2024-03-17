import { useGameDatabase } from "@/hooks/useGameDatabase";
import { getGameFromPgn } from "@/lib/chess";
import { GameOrigin } from "@/types/enums";
import {
  MenuItem,
  Select,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  OutlinedInput,
  DialogActions,
  Typography,
  Grid,
} from "@mui/material";
import { Chess } from "chess.js";
import { useState } from "react";
import GamePgnInput from "./gamePgnInput";
import ChessComInput from "./chessComInput";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import LichessInput from "./lichessInput";

interface Props {
  open: boolean;
  onClose: () => void;
  setGame?: (game: Chess) => void;
}

export default function NewGameDialog({ open, onClose, setGame }: Props) {
  const [pgn, setPgn] = useState("");
  const [gameOrigin, setGameOrigin] = useLocalStorage(
    "preferred-game-origin",
    GameOrigin.Pgn
  );
  const [parsingError, setParsingError] = useState("");
  const { addGame } = useGameDatabase();

  const handleAddGame = () => {
    if (!pgn) return;
    setParsingError("");

    try {
      const gameToAdd = getGameFromPgn(pgn);

      if (setGame) {
        setGame(gameToAdd);
      } else {
        addGame(gameToAdd);
      }

      handleClose();
    } catch (error) {
      console.error(error);
      setParsingError(
        error instanceof Error
          ? `${error.message} !`
          : "Unknown error while parsing PGN !"
      );
    }
  };

  const handleClose = () => {
    setPgn("");
    setParsingError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle marginY={1} variant="h5">
        {setGame ? "Load a game" : "Add a game to your database"}
      </DialogTitle>
      <DialogContent>
        <Grid
          container
          marginTop={1}
          alignItems="center"
          justifyContent="start"
          rowGap={2}
        >
          <FormControl sx={{ m: 1, width: 150 }}>
            <InputLabel id="dialog-select-label">Game origin</InputLabel>
            <Select
              labelId="dialog-select-label"
              id="dialog-select"
              displayEmpty
              input={<OutlinedInput label="Game origin" />}
              value={gameOrigin ?? ""}
              onChange={(e) => setGameOrigin(e.target.value as GameOrigin)}
            >
              {Object.values(GameOrigin).map((origin) => (
                <MenuItem key={origin} value={origin}>
                  {gameOriginLabel[origin]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {gameOrigin === GameOrigin.Pgn && (
            <GamePgnInput pgn={pgn} setPgn={setPgn} />
          )}

          {gameOrigin === GameOrigin.ChessCom && (
            <ChessComInput pgn={pgn} setPgn={setPgn} />
          )}

          {gameOrigin === GameOrigin.Lichess && (
            <LichessInput pgn={pgn} setPgn={setPgn} />
          )}

          {parsingError && (
            <FormControl fullWidth>
              <Typography color="red" textAlign="center" marginTop={1}>
                {parsingError}
              </Typography>
            </FormControl>
          )}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ m: 2 }}>
        <Button
          variant="outlined"
          sx={{ marginRight: 2 }}
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button variant="contained" onClick={handleAddGame}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const gameOriginLabel: Record<GameOrigin, string> = {
  [GameOrigin.Pgn]: "PGN",
  [GameOrigin.ChessCom]: "Chess.com",
  [GameOrigin.Lichess]: "Lichess.org",
};
