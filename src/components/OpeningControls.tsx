import React from "react";
import { Button, Stack } from "@mui/material";

interface OpeningControlsProps {
  moveIdx: number;
  selectedVariationMovesLength: number;
  allDone: boolean;
  onSkip: () => void;
  onReset: () => void;
  disabled?: boolean;
}

const OpeningControls: React.FC<OpeningControlsProps> = ({
  moveIdx,
  selectedVariationMovesLength,
  allDone,
  onSkip,
  onReset,
  disabled = false,
}) => (
  <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
    <Button
      variant="outlined"
      color="primary"
      fullWidth
      disabled={moveIdx >= selectedVariationMovesLength || allDone || disabled}
      onClick={onSkip}
    >
      Skip variation
    </Button>
    <Button
      variant="outlined"
      color="primary"
      fullWidth
      onClick={onReset}
      disabled={disabled}
    >
      Reset progress
    </Button>
  </Stack>
);

export default OpeningControls;
