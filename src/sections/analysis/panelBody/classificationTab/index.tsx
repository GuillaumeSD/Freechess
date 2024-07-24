import { Grid, GridProps } from "@mui/material";
import MovesPanel from "./movesPanel";
import MovesClassificationsRecap from "./movesClassificationsRecap";

export default function ClassificationTab(props: GridProps) {
  return (
    <Grid
      container
      item
      justifyContent="center"
      alignItems="start"
      height="100%"
      maxHeight="18rem"
      {...props}
      sx={
        props.hidden ? { display: "none" } : { overflow: "hidden", ...props.sx }
      }
    >
      <MovesPanel />

      <MovesClassificationsRecap />
    </Grid>
  );
}
