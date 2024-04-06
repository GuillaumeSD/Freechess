import { useCurrentPosition } from "../hooks/useCurrentPosition";
import { Grid, Typography } from "@mui/material";

export default function Opening() {
  const position = useCurrentPosition();

  const opening = position?.eval?.opening;
  if (!opening) return null;

  return (
    <Grid item xs={12}>
      <Typography align="center" fontSize="0.9rem">
        {opening}
      </Typography>
    </Grid>
  );
}
