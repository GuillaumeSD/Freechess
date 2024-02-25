import { Button } from "@mui/material";
import { useState } from "react";
import EngineSettingsDialog from "./engineSettingsDialog";

export default function EngineSettingsButton() {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <Button variant="contained" onClick={() => setOpenDialog(true)}>
        Engine Settings
      </Button>

      <EngineSettingsDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      />
    </>
  );
}
