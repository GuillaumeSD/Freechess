import { useSetAtom } from "jotai";
import { boardOrientationAtom } from "../states";
import { IconButton } from "@mui/material";
import { Icon } from "@iconify/react";

export default function FlipBoardButton() {
  const setBoardOrientation = useSetAtom(boardOrientationAtom);

  return (
    <IconButton onClick={() => setBoardOrientation((prev) => !prev)}>
      <Icon icon="eva:flip-fill" />
    </IconButton>
  );
}
