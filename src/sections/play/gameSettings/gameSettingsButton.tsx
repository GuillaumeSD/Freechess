import { Button } from "@mui/material";
import { useState } from "react";
import GameSettingsDialog from "./gameSettingsDialog";
import { gameAtom } from "../states";
import { useAtomValue } from "jotai";

export default function GameSettingsButton() {
  const [openDialog, setOpenDialog] = useState(false);
  const game = useAtomValue(gameAtom);

  return (
    <>
      <Button variant="contained" onClick={() => setOpenDialog(true)}>
        {game.history().length ? "Start new game" : "Start game"}
      </Button>

      <GameSettingsDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      />
    </>
  );
}
