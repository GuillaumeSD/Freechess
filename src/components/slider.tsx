import { Grid, Slider as MuiSlider, Typography } from "@mui/material";

interface Props {
  value: number;
  setValue: (value: number) => void;
  min: number;
  max: number;
  label: string;
  xs?: number;
  marksFilter?: number;
}

export default function Slider({
  min,
  max,
  label,
  value,
  setValue,
  xs,
  marksFilter = 1,
}: Props) {
  return (
    <Grid
      item
      container
      xs={xs ?? 11}
      justifyContent="center"
      alignItems="center"
    >
      <Typography id={`input-${label}`} textAlign="left" width="100%">
        {label}
      </Typography>

      <MuiSlider
        min={min}
        max={max}
        marks={Array.from({ length: max - min + 1 }, (_, i) => ({
          value: i + min,
          label: `${i + min}`,
        })).filter((_, i) => i % marksFilter === 0)}
        step={1}
        valueLabelDisplay="off"
        value={value}
        onChange={(_, value) => setValue(value as number)}
        aria-labelledby={`input-${label}`}
      />
    </Grid>
  );
}
