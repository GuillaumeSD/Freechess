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
      <ValueBlock value={whiteValue} color="white" />

      <Typography align="center" fontSize="0.8em">
        {title}
      </Typography>

      <ValueBlock value={blackValue} color="black" />
    </Grid>
  );
}

const ValueBlock = ({
  value,
  color,
}: {
  value: string | number;
  color: "white" | "black";
}) => {
  return (
    <Typography
      align="center"
      sx={{
        backgroundColor: color,
        color: color === "white" ? "black" : "white",
      }}
      borderRadius="5px"
      lineHeight="1em"
      fontSize="0.9em"
      padding={0.8}
      fontWeight="500"
      border="1px solid #424242"
    >
      {value}
    </Typography>
  );
};
