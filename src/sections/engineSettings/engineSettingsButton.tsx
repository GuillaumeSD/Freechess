import { IconButton, Tooltip } from "@mui/material";
import { useState } from "react";
import EngineSettingsDialog from "./engineSettingsDialog";
import { Icon } from "@iconify/react";

export default function EngineSettingsButton() {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <Tooltip title="Engine settings">
        <IconButton onClick={() => setOpenDialog(true)} sx={{ paddingY: 0.3 }}>
          <Icon icon="ri:settings-3-line" height={20} />
        </IconButton>
      </Tooltip>

      <EngineSettingsDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      />
    </>
  );
}
