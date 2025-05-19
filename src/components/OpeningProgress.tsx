import React, { useEffect, useState } from "react";
import LinearProgressBar from "./LinearProgressBar";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Props :
// - total : nombre total de variations
// - currentVariationIndex : index de la variation en cours (optionnel, pour affichage)

interface OpeningProgressProps {
  total: number;
  // Liste des index de variations terminées
  completed: number[];
}

const OpeningProgress: React.FC<OpeningProgressProps> = ({
  total,
  completed,
}) => {
  const [progress, setProgress] = useState<number[]>(completed);
  const theme = useTheme();

  useEffect(() => {
    setProgress(completed);
  }, [completed]);

  // Calcul du pourcentage
  const percent = total > 0 ? (progress.length / total) * 100 : 0;
  const label = `${progress.length} / ${total}`;

  return (
    <Box
      width={{ xs: "100%", sm: 320, md: 340 }}
      sx={{
        mt: { xs: 2, md: 3 },
        mb: { xs: 0, md: 1 },
        px: { xs: 0, sm: 1 },
        alignSelf: "flex-end",
        position: "relative",
        left: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Box minWidth={48}>
        <span style={{ fontSize: 14, color: theme.palette.text.secondary }}>{label}</span>
      </Box>
      <Box flex={1} minWidth={0}>
        <LinearProgressBar value={percent} label={""} />
      </Box>
    </Box>
  );
};

export default OpeningProgress;
