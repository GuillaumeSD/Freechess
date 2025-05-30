import { Icon } from "@iconify/react";
import { Grid2 as Grid, Typography } from "@mui/material";
import GamePanel from "./gamePanel";
import LoadGame from "./loadGame";
import AnalyzeButton from "./analyzeButton";
import LinearProgressBar from "@/components/LinearProgressBar";
import { useAtomValue } from "jotai";
import { evaluationProgressAtom } from "../states";

export default function PanelHeader() {
  const evaluationProgress = useAtomValue(evaluationProgressAtom);

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      rowGap={2}
      size={12}
    >
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        columnGap={1}
        size={12}
      >
        <Icon icon="streamline:clipboard-check" height={24} />

        <Typography variant="h5" align="center">
          Game Analysis
        </Typography>
      </Grid>

      <Grid
        container
        justifyContent="center"
        alignItems="center"
        rowGap={2}
        columnGap={12}
        size={12}
      >
        <GamePanel />
        <LoadGame />
        <AnalyzeButton />
        <LinearProgressBar value={evaluationProgress} label="Analyzing..." />
      </Grid>
    </Grid>
  );
}
