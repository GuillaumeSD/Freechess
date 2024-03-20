import { Button } from "@mui/material";
import { useState } from "react";
import GameSettingsDialog from "./gameSettingsDialog";
import { useAtomValue } from "jotai";
import { gameDataAtom } from "../states";

export default function GameSettingsButton() {
  const [openDialog, setOpenDialog] = useState(false);
  const gameData = useAtomValue(gameDataAtom);

  return (
    <>
      <Button variant="contained" onClick={() => setOpenDialog(true)}>
        {gameData.history.length ? "Start new game" : "Start game"}
      </Button>

      <GameSettingsDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      />
    </>
  );
}
