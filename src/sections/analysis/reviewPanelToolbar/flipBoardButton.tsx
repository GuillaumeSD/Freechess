import { useSetAtom } from "jotai";
import { boardOrientationAtom } from "../states";
import { IconButton, Tooltip } from "@mui/material";
import { Icon } from "@iconify/react";

export default function FlipBoardButton() {
  const setBoardOrientation = useSetAtom(boardOrientationAtom);

  return (
    <Tooltip title="Flip board">
      <IconButton
        onClick={() => setBoardOrientation((prev) => !prev)}
        sx={{ paddingX: 1.2, paddingY: 0.5 }}
      >
        <Icon icon="eva:flip-fill" />
      </IconButton>
    </Tooltip>
  );
}
