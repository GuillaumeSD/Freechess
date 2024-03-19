import { Button } from "@mui/material";
import { useState } from "react";
import GameSettingsDialog from "./gameSettingsDialog";

export default function GameSettingsButton() {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <Button variant="contained" onClick={() => setOpenDialog(true)}>
        Start game
      </Button>

      <GameSettingsDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      />
    </>
  );
}
