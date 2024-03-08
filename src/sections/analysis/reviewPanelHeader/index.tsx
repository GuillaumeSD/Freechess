import { Icon } from "@iconify/react";
import { Grid, Typography } from "@mui/material";
import GamePanel from "./gamePanel";
import LoadGame from "./loadGame";
import AnalyzeButton from "./analyzeButton";
import LinearProgressBar from "@/components/LinearProgressBar";
import { useAtomValue } from "jotai";
import { evaluationProgressAtom } from "../states";

export default function ReviewPanelHeader() {
  const evaluationProgress = useAtomValue(evaluationProgressAtom);

  return (
    <Grid
      item
      container
      justifyContent="center"
      alignItems="center"
      xs={12}
      rowGap={3}
    >
      <Grid
        item
        container
        xs={12}
        justifyContent="center"
        alignItems="center"
        columnGap={1}
      >
        <Icon icon="ph:file-magnifying-glass-fill" height={28} />

        <Typography variant="h5" align="center">
          Game Report
        </Typography>
      </Grid>

      <Grid
        item
        container
        xs={12}
        justifyContent="center"
        alignItems="center"
        rowGap={3}
        columnGap={12}
      >
        <GamePanel />
        <LoadGame />
        <AnalyzeButton />
        <LinearProgressBar value={evaluationProgress} label="Analyzing..." />
      </Grid>
    </Grid>
  );
}
