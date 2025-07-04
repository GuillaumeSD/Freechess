import { useEffect, useState, memo } from "react";
import LinearProgressBar from "./LinearProgressBar";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Props:
// - total: total number of variations
// - currentVariationIndex: index of the current variation (optional, for display)

/**
 * Progress bar for opening training, showing completed variations out of total.
 */
export interface OpeningProgressProps {
  total: number;
  // List of completed variation indexes
  completed: number[];
}

function OpeningProgress({ total, completed }: OpeningProgressProps) {
  const [progress, setProgress] = useState<number[]>(completed);
  const theme = useTheme();

  useEffect(() => {
    setProgress(completed);
  }, [completed]);

  // Calculate percentage
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
        <span style={{ fontSize: 14, color: theme.palette.text.secondary }}>
          {label}
        </span>
      </Box>
      <Box flex={1} minWidth={0}>
        <LinearProgressBar value={percent} label={""} />
      </Box>
    </Box>
  );
}

export default memo(OpeningProgress);
