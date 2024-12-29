import { Checkbox, FormControlLabel, Grid2 as Grid } from "@mui/material";
import {
  showBestMoveArrowAtom,
  showPlayerMoveIconAtom,
} from "../analysis/states";
import { useAtomLocalStorage } from "@/hooks/useAtomLocalStorage";

export default function ArrowOptions() {
  const [showBestMove, setShowBestMove] = useAtomLocalStorage(
    "show-arrow-best-move",
    showBestMoveArrowAtom
  );
  const [showPlayerMoveIcon, setShowPlayerMoveIcon] = useAtomLocalStorage(
    "show-icon-player-move",
    showPlayerMoveIconAtom
  );

  return (
    <Grid
      container
      justifyContent="space-evenly"
      alignItems="center"
      size={12}
      gap={3}
    >
      <FormControlLabel
        control={
          <Checkbox
            checked={showBestMove}
            onChange={(_, checked) => setShowBestMove(checked)}
          />
        }
        label="Show engine best move arrow"
        sx={{ marginX: 0 }}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={showPlayerMoveIcon}
            onChange={(_, checked) => setShowPlayerMoveIcon(checked)}
          />
        }
        label="Show played move icon"
        sx={{ marginX: 0 }}
      />
    </Grid>
  );
}
