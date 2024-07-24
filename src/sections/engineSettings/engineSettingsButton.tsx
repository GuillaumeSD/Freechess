import { Fab } from "@mui/material";
import { useState } from "react";
import EngineSettingsDialog from "./engineSettingsDialog";
import { Icon } from "@iconify/react";

export default function EngineSettingsButton() {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <Fab
        title="Engine settings"
        color="secondary"
        size="small"
        sx={{
          top: "auto",
          right: 16,
          bottom: 16,
          left: "auto",
          position: "fixed",
        }}
        onClick={() => setOpenDialog(true)}
      >
        <Icon icon="mdi:settings" height={20} />
      </Fab>

      <EngineSettingsDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      />
    </>
  );
}
