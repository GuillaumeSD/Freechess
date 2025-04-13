import { Grid2 as Grid, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import { gameEvalAtom } from "../../states";
type props = {
  params: "accurecy" | "rating";
};

export default function Accuracies(props: props) {
  const gameEval = useAtomValue(gameEvalAtom);

  if (!gameEval) return null;

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
        {props.params === "accurecy"
          ? `${gameEval?.accuracy.white.toFixed(1)} %`
          : `${Math.round(gameEval?.estimatedElo.white as number)}`}
      </Typography>

      <Typography align="center">
        {props.params === "accurecy" ? "Accuracies" : "Estimated Elo"}
      </Typography>
      <Typography
        align="center"
        sx={{ backgroundColor: "black", color: "white" }}
        borderRadius="5px"
        lineHeight={1}
        padding={1}
        fontWeight="bold"
        border="1px solid #424242"
      >
        {props.params === "accurecy"
          ? `${gameEval?.accuracy.black.toFixed(1)} %`
          : `${Math.round(gameEval?.estimatedElo.black as number)}`}
      </Typography>
    </Grid>
  );
}
