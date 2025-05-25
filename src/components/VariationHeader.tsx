import React from "react";
import { Typography, Stack, Button } from "@mui/material";

interface VariationHeaderProps {
  variationName?: string;
  trainingMode: boolean;
  onSetTrainingMode: (training: boolean) => void;
  variationComplete: boolean;
}

const VariationHeader: React.FC<VariationHeaderProps> = ({
  variationName,
  trainingMode,
  onSetTrainingMode,
  variationComplete,
}) => (
  <>
    <Typography variant="h4" gutterBottom sx={{ mb: 2, wordBreak: 'break-word', textAlign: 'center', width: '100%' }}>
      {variationName}
    </Typography>

    <Stack direction="row" spacing={2} sx={{ mb: 3, justifyContent: 'center', width: '100%' }}>
      <Button variant={trainingMode ? "contained" : "outlined"} onClick={() => onSetTrainingMode(true)} fullWidth>
        Training Mode
      </Button>
      <Button variant={!trainingMode ? "contained" : "outlined"} onClick={() => onSetTrainingMode(false)} fullWidth>
        Learning Mode
      </Button>
    </Stack>
    {variationComplete ? (
      <Typography color="success.main" sx={{ mb: 2, textAlign: 'center' }}>Variation complete! Next variation loading…</Typography>
    ) : trainingMode ? (
      <Typography color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>Play the correct move to continue.</Typography>
    ) : (
      <Typography color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>Play the move indicated by the arrow to continue.</Typography>
    )}
  </>
);

export default VariationHeader;
