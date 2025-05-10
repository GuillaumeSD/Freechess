import { useState } from "react";
import { useCurrentPosition } from "../../hooks/useCurrentPosition";
import { Grid2 as Grid, Skeleton, Typography } from "@mui/material";

export default function Opening() {
  const position = useCurrentPosition();
  const [lastOpening, setLastOpening] = useState("");

  const lastMove = position?.lastMove;
  if (!lastMove && lastOpening) {
    setLastOpening("");
  }
  if (!lastMove) return null;

  const opening = position?.eval?.opening || lastOpening;
  if (opening && opening !== lastOpening) {
    setLastOpening(opening);
  }

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
