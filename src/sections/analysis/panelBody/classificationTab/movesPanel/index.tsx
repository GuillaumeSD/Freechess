import { Grid } from "@mui/material";
import MovesLine from "./movesLine";
import { useMemo } from "react";
import { useAtomValue } from "jotai";
import { gameAtom, gameEvalAtom } from "../../../states";
import { MoveClassification } from "@/types/enums";

export default function MovesPanel() {
  const game = useAtomValue(gameAtom);
  const gameEval = useAtomValue(gameEvalAtom);

  const gameMoves = useMemo(() => {
    const history = game.history();
    if (!history.length) return undefined;

    const moves: { san: string; moveClassification?: MoveClassification }[][] =
      [];

    for (let i = 0; i < history.length; i += 2) {
      const items = [
        {
          san: history[i],
          moveClassification: gameEval?.positions[i + 1]?.moveClassification,
        },
      ];

      if (history[i + 1]) {
        items.push({
          san: history[i + 1],
          moveClassification: gameEval?.positions[i + 2]?.moveClassification,
        });
      }

      moves.push(items);
    }

    return moves;
  }, [game, gameEval]);

  return (
    <Grid
      container
      item
      justifyContent="center"
      alignItems="start"
      gap={0.8}
      sx={{ scrollbarWidth: "thin", overflowY: "auto" }}
      maxHeight="100%"
      xs={6}
      id="moves-panel"
    >
      {gameMoves?.map((moves, idx) => (
        <MovesLine
          key={`${moves.map(({ san }) => san).join()}-${idx}`}
          moves={moves}
          moveNb={idx + 1}
        />
      ))}
    </Grid>
  );
}
