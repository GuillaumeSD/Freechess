import {
  Grid,
  LinearProgress,
  LinearProgressProps,
  Typography,
  linearProgressClasses,
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
        width="90%"
        alignItems="center"
        justifyContent="center"
        wrap="nowrap"
      >
        <Grid item sx={{ width: "100%", mr: 2 }}>
          <LinearProgress
            variant="determinate"
            {...props}
            sx={(theme) => ({
              borderRadius: "5px",
              height: "5px",
              [`&.${linearProgressClasses.colorPrimary}`]: {
                backgroundColor:
                  theme.palette.grey[
                    theme.palette.mode === "light" ? 200 : 700
                  ],
              },
              [`& .${linearProgressClasses.bar}`]: {
                borderRadius: 5,
                backgroundColor: "#308fe8",
              },
            })}
          />
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
