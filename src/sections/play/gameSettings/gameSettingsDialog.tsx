import Slider from "@/components/slider";
import { Color, EngineName } from "@/types/enums";
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
  FormGroup,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useAtomLocalStorage } from "@/hooks/useAtomLocalStorage";
import { useAtom, useSetAtom } from "jotai";
import {
  engineEloAtom,
  playerColorAtom,
  isGameInProgressAtom,
  gameAtom,
  enginePlayNameAtom,
} from "../states";
import { useChessActions } from "@/hooks/useChessActions";
import { playGameStartSound } from "@/lib/sounds";
import { logAnalyticsEvent } from "@/lib/firebase";
import { useEffect } from "react";
import { isEngineSupported } from "@/lib/engine/shared";
import { Stockfish16_1 } from "@/lib/engine/stockfish16_1";
import { engineLabel } from "@/sections/engineSettings/engineSettingsDialog";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function GameSettingsDialog({ open, onClose }: Props) {
  const [engineElo, setEngineElo] = useAtomLocalStorage(
    "engine-elo",
    engineEloAtom
  );
  const [engineName, setEngineName] = useAtomLocalStorage(
    "engine-play-name",
    enginePlayNameAtom
  );
  const [playerColor, setPlayerColor] = useAtom(playerColorAtom);
  const setIsGameInProgress = useSetAtom(isGameInProgressAtom);
  const { reset: resetGame } = useChessActions(gameAtom);

  const handleGameStart = () => {
    onClose();
    resetGame({
      white: {
        name:
          playerColor === Color.White ? "You" : engineLabel[engineName].small,
        rating: playerColor === Color.White ? undefined : engineElo,
      },
      black: {
        name:
          playerColor === Color.Black ? "You" : engineLabel[engineName].small,
        rating: playerColor === Color.Black ? undefined : engineElo,
      },
    });
    playGameStartSound();
    setIsGameInProgress(true);

    logAnalyticsEvent("play_game", {
      engine: engineName,
      engineElo,
      playerColor,
    });
  };

  useEffect(() => {
    if (!isEngineSupported(engineName)) {
      if (Stockfish16_1.isSupported()) {
        setEngineName(EngineName.Stockfish16_1Lite);
      } else {
        setEngineName(EngineName.Stockfish11);
      }
    }
  }, [setEngineName, engineName]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle marginY={1} variant="h5">
        Set game parameters
      </DialogTitle>
      <DialogContent sx={{ paddingBottom: 0 }}>
        <Typography>
          Stockfish 17 Lite is the default engine if your device support its
          requirements. It offers the best balance between speed and strength.
          Stockfish 17 is the strongest engine available, note that it requires
          a one time download of 75MB.
        </Typography>
        <Grid
          marginTop={4}
          container
          justifyContent="center"
          alignItems="center"
          rowGap={3}
          size={12}
        >
          <Grid container justifyContent="center" size={12}>
            <FormControl variant="outlined">
              <InputLabel id="dialog-select-label">Bot's engine</InputLabel>
              <Select
                labelId="dialog-select-label"
                id="dialog-select"
                displayEmpty
                input={<OutlinedInput label="Engine" />}
                value={engineName}
                onChange={(e) => setEngineName(e.target.value as EngineName)}
                sx={{ width: 280, maxWidth: "100%" }}
              >
                {Object.values(EngineName).map((engine) => (
                  <MenuItem
                    key={engine}
                    value={engine}
                    disabled={!isEngineSupported(engine)}
                  >
                    {engineLabel[engine].full}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Slider
            label="Bot Elo rating"
            value={engineElo}
            setValue={setEngineElo}
            min={1320}
            max={3190}
            step={10}
            marksFilter={374}
          />

          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  color="default"
                  checked={playerColor === Color.White}
                  onChange={(e) => {
                    setPlayerColor(
                      e.target.checked ? Color.White : Color.Black
                    );
                  }}
                />
              }
              label={
                playerColor === Color.White
                  ? "You play as White"
                  : "You play as Black"
              }
            />
          </FormGroup>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ m: 2 }}>
        <Button variant="outlined" sx={{ marginRight: 2 }} onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleGameStart}>
          Start game
        </Button>
      </DialogActions>
    </Dialog>
  );
}
