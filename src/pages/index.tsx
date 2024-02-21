import Board from "@/sections/gameReport/board";
import ReviewPanelBody from "@/sections/gameReport/reviewPanelBody";
import ReviewPanelHeader from "@/sections/gameReport/reviewPanelHeader";
import ReviewPanelToolBar from "@/sections/gameReport/reviewPanelToolbar";
import { Grid } from "@mui/material";

export default function GameReport() {
  return (
    <Grid
      container
      rowGap={2}
      justifyContent="center"
      alignItems="center"
      marginTop={1}
    >
      <Board />

      <Grid
        item
        container
        rowGap={2}
        paddingLeft={{ xs: 0, md: 6 }}
        justifyContent="center"
        alignItems="center"
        xs={12}
        md={6}
      >
        <Grid
          container
          item
          rowGap={3}
          columnGap={1}
          justifyContent="center"
          alignItems="center"
          borderRadius={2}
          border={1}
          borderColor={"secondary.main"}
          xs={12}
          sx={{
            backgroundColor: "secondary.main",
            borderRadius: 2,
            borderColor: "primary.main",
            borderWidth: 2,
          }}
          paddingY={3}
        >
          <ReviewPanelHeader />

          <ReviewPanelBody />

          <ReviewPanelToolBar />
        </Grid>
      </Grid>
    </Grid>
  );
}
