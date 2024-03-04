import { useCurrentMove } from "@/hooks/useCurrentMove";
import { Grid, Typography } from "@mui/material";

export default function Opening() {
  const move = useCurrentMove();

  const opening = move?.eval?.opening;
  if (!opening) return null;

  return (
    <Grid item xs={12}>
      <Typography align="center">{opening}</Typography>
    </Grid>
  );
}
