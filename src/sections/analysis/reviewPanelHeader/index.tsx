import { Icon } from "@iconify/react";
import { Grid, Typography } from "@mui/material";
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
        gap={3}
      >
        <GamePanel />
        <LoadGame />
      </Grid>
    </Grid>
  );
}
