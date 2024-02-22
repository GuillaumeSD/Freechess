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
  Box,
  FormControl,
  InputLabel,
  OutlinedInput,
  DialogActions,
  TextField,
  Typography,
} from "@mui/material";
import { Chess } from "chess.js";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  setGame?: (game: Chess) => void;
}

export default function NewGameDialog({ open, onClose, setGame }: Props) {
  const [pgn, setPgn] = useState("");
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
        Add a game to your database
      </DialogTitle>
      <DialogContent>
        <Typography>Only PGN input is supported at the moment</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap" }} marginTop={4}>
          <FormControl sx={{ m: 1, width: 150 }}>
            <InputLabel id="dialog-select-label">Game origin</InputLabel>
            <Select
              labelId="dialog-select-label"
              id="dialog-select"
              displayEmpty
              input={<OutlinedInput label="Game origin" />}
              value={GameOrigin.Pgn}
              disabled={true}
            >
              {Object.values(GameOrigin).map((origin) => (
                <MenuItem key={origin} value={origin}>
                  {gameOriginLabel[origin]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, width: 600 }}>
            <TextField
              label="Enter PGN here..."
              variant="outlined"
              multiline
              value={pgn}
              onChange={(e) => setPgn(e.target.value)}
            />
          </FormControl>
          {parsingError && (
            <FormControl fullWidth>
              <Typography color="red" textAlign="center" marginTop={1}>
                {parsingError}
              </Typography>
            </FormControl>
          )}
        </Box>
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
  [GameOrigin.Lichess]: "Lichess",
};
