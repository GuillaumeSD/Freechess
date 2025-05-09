import { Grid2 as Grid, Typography } from "@mui/material";

interface Props {
  title: string;
  whiteValue: string | number;
  blackValue: string | number;
}

export default function PlayersMetric({
  title,
  whiteValue,
  blackValue,
}: Props) {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      columnGap={{ xs: "8vw", md: 10 }}
      size={12}
    >
      <Typography
        align="center"
        sx={{ backgroundColor: "white", color: "black" }}
        borderRadius="5px"
        lineHeight={1}
        padding={1}
        fontWeight="bold"
        border="1px solid #424242"
      >
        {whiteValue}
      </Typography>

      <Typography align="center">{title}</Typography>
      <Typography
        align="center"
        sx={{ backgroundColor: "black", color: "white" }}
        borderRadius="5px"
        lineHeight={1}
        padding={1}
        fontWeight="bold"
        border="1px solid #424242"
      >
        {blackValue}
      </Typography>
    </Grid>
  );
}
