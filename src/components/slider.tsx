import { Grid2 as Grid, Slider as MuiSlider, Typography } from "@mui/material";

export interface Props {
  value: number;
  setValue: (value: number) => void;
  min: number;
  max: number;
  label: string;
  size?: number;
  step?: number;
}

export default function Slider({
  min,
  max,
  label,
  value,
  setValue,
  size,
  step = 1,
}: Props) {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      size={size ?? 11}
    >
      <Typography id={`input-${label}`} textAlign="left" width="100%">
        {`${label}: ${value}`}
      </Typography>

      <MuiSlider
        min={min}
        max={max}
        step={step}
        valueLabelDisplay="auto"
        value={value}
        onChange={(_, value) => setValue(value as number)}
        aria-labelledby={`input-${label}`}
      />
    </Grid>
  );
}
