import Board from "@/sections/play/board";
import { CircularProgress, Divider, Grid, Typography } from "@mui/material";

export default function Play() {
  return (
    <Grid container gap={4} justifyContent="space-evenly" alignItems="start">
      <Board />

      <Grid
        container
        item
        marginTop={{ xs: 0, lg: "2.5em" }}
        justifyContent="center"
        alignItems="center"
        borderRadius={2}
        border={1}
        borderColor={"secondary.main"}
        xs={12}
        lg
        sx={{
          backgroundColor: "secondary.main",
          borderColor: "primary.main",
          borderWidth: 2,
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
        }}
        padding={3}
        rowGap={3}
        style={{
          maxWidth: "1100px",
        }}
      >
        <Grid
          item
          container
          xs={12}
          justifyContent="center"
          alignItems="center"
          columnGap={2}
        >
          <Typography>Game in progress</Typography>
          <CircularProgress size={20} color="info" />
        </Grid>

        <Divider sx={{ width: "90%" }} />
      </Grid>
    </Grid>
  );
}
