import Slider from "@/components/slider";
import { EngineName } from "@/types/enums";
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
import {
  engineNameAtom,
  engineDepthAtom,
  engineMultiPvAtom,
} from "../analysis/states";
import ArrowOptions from "./arrowOptions";
import { useAtomLocalStorage } from "@/hooks/useAtomLocalStorage";
import { Stockfish16 } from "@/lib/engine/stockfish16";
import { useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function EngineSettingsDialog({ open, onClose }: Props) {
  const [depth, setDepth] = useAtomLocalStorage(
    "engine-depth",
    engineDepthAtom
  );
  const [multiPv, setMultiPv] = useAtomLocalStorage(
    "engine-multi-pv",
    engineMultiPvAtom
  );
  const [engineName, setEngineName] = useAtomLocalStorage(
    "engine-name",
    engineNameAtom
  );

  useEffect(() => {
    if (!Stockfish16.isSupported()) {
      setEngineName(EngineName.Stockfish11);
    }
  }, [setEngineName]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle marginY={1} variant="h5">
        Set engine parameters
      </DialogTitle>
      <DialogContent sx={{ paddingBottom: 0 }}>
        <Typography>
          Stockfish 16 Lite (HCE) is the default engine. It offers the best
          balance between speed and strength. Stockfish 16 is the strongest
          engine available, but please note that it requires a one time download
          of 40MB.
        </Typography>
        <Grid
          marginTop={4}
          item
          container
          justifyContent="center"
          alignItems="center"
          xs={12}
          rowGap={3}
        >
          <Grid item container xs={12} justifyContent="center">
            <FormControl variant="outlined">
              <InputLabel id="dialog-select-label">Engine</InputLabel>
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
                    disabled={
                      engine.includes("stockfish_16")
                        ? !Stockfish16.isSupported()
                        : false
                    }
                  >
                    {engineLabel[engine]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Slider
            label="Maximum depth"
            value={depth}
            setValue={setDepth}
            min={10}
            max={30}
            marksFilter={2}
          />

          <Slider
            label="Number of lines"
            value={multiPv}
            setValue={setMultiPv}
            min={2}
            max={6}
            xs={6}
          />

          <ArrowOptions />
        </Grid>
      </DialogContent>
      <DialogActions sx={{ m: 2 }}>
        <Button variant="contained" onClick={onClose}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const engineLabel: Record<EngineName, string> = {
  [EngineName.Stockfish16]: "Stockfish 16 Lite (HCE)",
  [EngineName.Stockfish16NNUE]: "Stockfish 16 (40MB download)",
  [EngineName.Stockfish11]: "Stockfish 11",
};
