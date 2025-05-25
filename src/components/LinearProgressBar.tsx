import {
  Grid2 as Grid,
  LinearProgress,
  LinearProgressProps,
  Typography,
  linearProgressClasses,
} from "@mui/material";

/**
 * A styled linear progress bar with optional label and percentage display.
 */
interface LinearProgressBarProps extends LinearProgressProps {
  value: number;
  label: string;
}

function LinearProgressBar({ value, label, ...rest }: LinearProgressBarProps) {
  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      wrap="nowrap"
      width="90%"
      columnGap={2}
      size={12}
    >
      <Typography variant="caption" align="center" aria-label="progress-label">
        {label}
      </Typography>
      <Grid sx={{ width: "100%" }}>
        <LinearProgress
          variant="determinate"
          value={value}
          aria-valuenow={value}
          aria-valuemax={100}
          aria-label={label}
          {...rest}
          sx={(theme) => ({
            borderRadius: "5px",
            height: "5px",
            [`&.${linearProgressClasses.colorPrimary}`]: {
              backgroundColor:
                theme.palette.grey[theme.palette.mode === "light" ? 200 : 700],
            },
            [`& .${linearProgressClasses.bar}`]: {
              borderRadius: 5,
              backgroundColor: "#308fe8",
            },
          })}
        />
      </Grid>
      <Grid>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          value
        )}%`}</Typography>
      </Grid>
    </Grid>
  );
};

export default LinearProgressBar;
