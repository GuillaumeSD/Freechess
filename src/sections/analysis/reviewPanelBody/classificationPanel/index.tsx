import { Divider, Grid } from "@mui/material";
import MovesPanel from "./movesPanel";
import MovesClassificationsRecap from "./movesClassificationsRecap";
import { useAtomValue } from "jotai";
import { gameAtom } from "../../states";

export default function ClassificationPanel() {
  const game = useAtomValue(gameAtom);

  if (!game.history().length) return null;

  return (
    <>
      <Divider sx={{ marginX: "5%" }} />

      <Grid
        container
        item
        justifyContent="center"
        alignItems="start"
        height="100%"
        minHeight={{ lg: "50px", xs: undefined }}
        sx={{ overflow: "hidden" }}
      >
        <MovesPanel />

        <MovesClassificationsRecap />
      </Grid>
    </>
  );
}
