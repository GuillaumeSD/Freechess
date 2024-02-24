import { Button } from "@mui/material";
import { useState } from "react";
import NewGameDialog from "./loadGameDialog";
import { Chess } from "chess.js";

interface Props {
  setGame?: (game: Chess) => void;
  label?: string;
}

export default function LoadGameButton({ setGame, label }: Props) {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <Button variant="contained" onClick={() => setOpenDialog(true)}>
        {label || "Add game"}
      </Button>

      <NewGameDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        setGame={setGame}
      />
    </>
  );
}
