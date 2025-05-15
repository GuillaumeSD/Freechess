import { useAtomValue } from "jotai";
import { Grid, Skeleton, Typography } from "@mui/material";
import { currentPositionAtom } from "../../states";

export default function Opening() {
  const position = useAtomValue(currentPositionAtom);

  const lastMove = position?.lastMove;
  if (!lastMove) return null;

  const opening = position?.eval?.opening || position.opening;

  if (!opening) {
    return (
      <Grid size={12} justifyItems="center" alignContent="center">
        <Skeleton
          variant="rounded"
          animation="wave"
          width={"12em"}
          sx={{ color: "transparent", maxWidth: "7vw", maxHeight: "3.5vw" }}
        >
          <Typography align="center" fontSize="0.9rem">
            placeholder
          </Typography>
        </Skeleton>
      </Grid>
    );
  }

  return (
    <Grid size={12}>
      <Typography align="center" fontSize="0.9rem">
        {opening}
      </Typography>
    </Grid>
  );
}
