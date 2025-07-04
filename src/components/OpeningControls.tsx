import { Button, Stack } from "@mui/material";
import { memo } from "react";

/**
 * Control buttons for skipping or resetting the opening variation.
 */
export interface OpeningControlsProps {
  moveIdx: number;
  selectedVariationMovesLength: number;
  allDone: boolean;
  onSkip: () => void;
  onReset: () => void;
  disabled?: boolean;
}

function OpeningControls({
  moveIdx,
  selectedVariationMovesLength,
  allDone,
  onSkip,
  onReset,
  disabled = false,
}: OpeningControlsProps) {
  return (
    <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
      <Button
        variant="outlined"
        color="primary"
        fullWidth
        disabled={
          moveIdx >= selectedVariationMovesLength || allDone || disabled
        }
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
}

export default memo(OpeningControls);
