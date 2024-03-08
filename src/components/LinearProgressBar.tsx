import {
  Grid,
  LinearProgress,
  LinearProgressProps,
  Typography,
} from "@mui/material";

const LinearProgressBar = (
  props: LinearProgressProps & { value: number; label: string }
) => {
  if (props.value === 0) return null;

  return (
    <Grid item container alignItems="center" justifyContent="center" xs={12}>
      <Typography variant="caption" align="center">
        {props.label}
      </Typography>
      <Grid
        item
        container
        xs={12}
        alignItems="center"
        justifyContent="center"
        wrap="nowrap"
      >
        <Grid item sx={{ width: "100%", mr: 2 }}>
          <LinearProgress variant="determinate" {...props} />
        </Grid>
        <Grid item sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            props.value
          )}%`}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default LinearProgressBar;
