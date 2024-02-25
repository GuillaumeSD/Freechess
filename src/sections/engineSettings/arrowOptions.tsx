import { Checkbox, FormControlLabel, Grid } from "@mui/material";
import { useAtom } from "jotai";
import {
  showBestMoveArrowAtom,
  showPlayerMoveArrowAtom,
} from "../analysis/states";

export default function ArrowOptions() {
  const [showBestMove, setShowBestMove] = useAtom(showBestMoveArrowAtom);
  const [showPlayerMove, setShowPlayerMove] = useAtom(showPlayerMoveArrowAtom);

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
