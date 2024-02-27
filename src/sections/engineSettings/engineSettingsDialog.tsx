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
import { engineDepthAtom, engineMultiPvAtom } from "../analysis/states";
import ArrowOptions from "./arrowOptions";
import { useAtomLocalStorage } from "@/hooks/useAtomLocalStorage";

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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle marginY={1} variant="h5">
        Set engine parameters
      </DialogTitle>
      <DialogContent sx={{ paddingBottom: 0 }}>
        <Typography>
          Stockfish 16 is the only engine available now, more engine choices
          will come soon !
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
                value={EngineName.Stockfish16}
                disabled={true}
                sx={{ width: 200 }}
              >
                {Object.values(EngineName).map((engine) => (
                  <MenuItem key={engine} value={engine}>
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
            min={1}
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
  [EngineName.Stockfish16]: "Stockfish 16",
};
