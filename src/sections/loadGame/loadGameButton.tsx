import { Button } from "@mui/material";
import { useState } from "react";
import NewGameDialog from "./loadGameDialog";
import { Chess } from "chess.js";

interface Props {
  setGame?: (game: Chess) => void;
  label?: string;
  size?: "small" | "medium" | "large";
}

export default function LoadGameButton({ setGame, label, size }: Props) {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <Button
        variant="contained"
        onClick={() => setOpenDialog(true)}
        size={size}
      >
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
