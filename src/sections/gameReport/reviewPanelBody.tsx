import { Icon } from "@iconify/react";
import {
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useAtomValue } from "jotai";
import { boardAtom, gameEvalAtom } from "./states";

export default function ReviewPanelBody() {
  const board = useAtomValue(boardAtom);
  const gameEval = useAtomValue(gameEvalAtom);
  if (!gameEval) return null;

  const evalIndex = board.history().length;
  const moveEval = gameEval.moves[evalIndex];

  return (
    <>
      <Divider sx={{ width: "90%", marginY: 3 }} />

      <Grid
        item
        container
        xs={12}
        justifyContent="center"
        alignItems="center"
        columnGap={1}
      >
        <Icon
          icon="pepicons-pop:star-filled-circle"
          color="#27f019"
          height={30}
        />
        <Typography variant="h5" align="center">
          Bilan de la partie
        </Typography>
      </Grid>

      <Typography variant="h6" align="center">
        {moveEval ? `${moveEval.bestMove} is the best move` : "Game is over"}
      </Typography>

      <Grid item container xs={12} justifyContent="center" alignItems="center">
        <List>
          {moveEval?.lines.map((line) => (
            <ListItem disablePadding key={line.pv[0]}>
              <ListItemText
                primary={
                  line.cp !== undefined
                    ? line.cp / 100
                    : `Mate in ${Math.abs(line.mate ?? 0)}`
                }
                sx={{ marginRight: 2 }}
              />
              <Typography>{line.pv.slice(0, 7).join(", ")}</Typography>
            </ListItem>
          ))}
        </List>
      </Grid>
    </>
  );
}
