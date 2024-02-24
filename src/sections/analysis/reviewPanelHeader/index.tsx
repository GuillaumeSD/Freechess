import { Icon } from "@iconify/react";
import { Divider, Grid, Typography } from "@mui/material";
import AnalyzePanel from "./analyzePanel";
import GamePanel from "./gamePanel";
import LoadGame from "./loadGame";

export default function ReviewPanelHeader() {
  return (
    <Grid
      item
      container
      justifyContent="center"
      alignItems="center"
      xs={12}
      gap={3}
    >
      <Grid
        item
        container
        xs={12}
        justifyContent="center"
        alignItems="center"
        columnGap={1}
      >
        <Icon icon="ph:file-magnifying-glass-fill" height={40} />
        <Typography variant="h4" align="center">
          Game Report
        </Typography>
      </Grid>

      <Grid
        item
        container
        xs={12}
        justifyContent="center"
        alignItems="center"
        gap={4}
      >
        <GamePanel />
        <LoadGame />
      </Grid>

      <Divider sx={{ width: "90%", marginY: 3 }} />

      <AnalyzePanel />
    </Grid>
  );
}
