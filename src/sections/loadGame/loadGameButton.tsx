import { Button } from "@mui/material";
import { useState } from "react";
import NewGameDialog from "./loadGameDialog";

export default function LoadGameButton() {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <Button variant="contained" onClick={() => setOpenDialog(true)}>
        Add a game
      </Button>

      <NewGameDialog open={openDialog} onClose={() => setOpenDialog(false)} />
    </>
  );
}
