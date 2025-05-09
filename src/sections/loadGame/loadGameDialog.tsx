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
  Grid2 as Grid,
} from "@mui/material";
import { setContext as setSentryContext } from "@sentry/react";
import { Chess } from "chess.js";
import { useState } from "react";
import GamePgnInput from "./gamePgnInput";
import ChessComInput from "./chessComInput";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import LichessInput from "./lichessInput";
import { useSetAtom } from "jotai";
import { boardOrientationAtom } from "../analysis/states";

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
  const setBoardOrientation = useSetAtom(boardOrientationAtom);
  const { addGame } = useGameDatabase();

  const handleAddGame = (pgn: string) => {
    if (!pgn) return;
    setParsingError("");

    try {
      const gameToAdd = getGameFromPgn(pgn);
      setSentryContext("loadedGame", { pgn });

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
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          position: "fixed",
          top: 0,
        },
      }}
    >
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
              onChange={(e) => {
                setGameOrigin(e.target.value as GameOrigin);
                setParsingError("");
              }}
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
            <ChessComInput onSelect={handleAddGame} />
          )}

          {gameOrigin === GameOrigin.Lichess && (
            <LichessInput onSelect={handleAddGame} />
          )}

          {parsingError && (
            <FormControl fullWidth>
              <Typography color="salmon" textAlign="center" marginTop={1}>
                {parsingError}
              </Typography>
            </FormControl>
          )}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ m: 2 }}>
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        {gameOrigin === GameOrigin.Pgn && (
          <Button
            variant="contained"
            sx={{ marginLeft: 2 }}
            onClick={() => {
              setBoardOrientation(true);
              handleAddGame(pgn);
            }}
          >
            Add
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

const gameOriginLabel: Record<GameOrigin, string> = {
  [GameOrigin.Pgn]: "PGN",
  [GameOrigin.ChessCom]: "Chess.com",
  [GameOrigin.Lichess]: "Lichess.org",
};
