import { Stack, Typography } from "@mui/material";

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
    <Stack
      justifyContent="center"
      alignItems="center"
      flexDirection="row"
      columnGap={{ xs: "8vw", md: 10 }}
    >
      <ValueBlock value={whiteValue} color="white" />

      <Typography align="center" fontSize="0.8em" noWrap>
        {title}
      </Typography>

      <ValueBlock value={blackValue} color="black" />
    </Stack>
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
      noWrap
    >
      {value}
    </Typography>
  );
};
