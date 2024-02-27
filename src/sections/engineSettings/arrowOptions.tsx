import { Checkbox, FormControlLabel, Grid } from "@mui/material";
import {
  showBestMoveArrowAtom,
  showPlayerMoveArrowAtom,
} from "../analysis/states";
import { useAtomLocalStorage } from "@/hooks/useAtomLocalStorage";

export default function ArrowOptions() {
  const [showBestMove, setShowBestMove] = useAtomLocalStorage(
    "show-arrow-best-move",
    showBestMoveArrowAtom
  );
  const [showPlayerMove, setShowPlayerMove] = useAtomLocalStorage(
    "show-arrow-player-move",
    showPlayerMoveArrowAtom
  );

  return (
    <Grid
      container
      item
      justifyContent="space-evenly"
      alignItems="center"
      xs={12}
      gap={3}
    >
      <FormControlLabel
        control={
          <Checkbox
            checked={showBestMove}
            onChange={(_, checked) => setShowBestMove(checked)}
          />
        }
        label="Show best move green arrow"
        sx={{ marginX: 0 }}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={showPlayerMove}
            onChange={(_, checked) => setShowPlayerMove(checked)}
          />
        }
        label="Show player move yellow arrow"
        sx={{ marginX: 0 }}
      />
    </Grid>
  );
}
