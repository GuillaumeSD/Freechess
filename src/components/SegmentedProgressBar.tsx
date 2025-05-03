import React from "react";
import { Box, Grid2 as Grid, Typography, useTheme } from "@mui/material";

interface SegmentedProgressBarProps {
  completed: number;
  total: number;
  height?: number;
  gap?: number;
  label?: string;
}

const SegmentedProgressBar: React.FC<SegmentedProgressBarProps> = ({
  completed,
  total,
  height = 5,
  gap = 1,
  label,
}) => {
  const theme = useTheme();
  if (total <= 0) return null;
  
  // build background colors for each segment: completed (blue), current (green), remaining (grey)
  const segments = Array.from({ length: total }, (_, idx) => {
    if (idx < completed) {
      return "#308fe8";
    } else if (idx === completed) {
      return theme.palette.success.main;
    } else {
      return theme.palette.grey[theme.palette.mode === "light" ? 300 : 700];
    }
  });

  const percent = Math.round((completed / total) * 100);

  return (
    <>
      {label && (
        <Typography variant="caption" align="center" gutterBottom>
          {label}
        </Typography>
      )}
      <Grid container alignItems="center" justifyContent="center" wrap="nowrap">
        {segments.map((bg, idx) => (
          <Box
            key={idx}
            sx={{
              flexGrow: 1,
              height,
              backgroundColor: bg,
              borderRadius: 1,
              marginLeft: idx === 0 ? 0 : gap,
            }}
          />
        ))}
        <Box sx={{ marginLeft: 1 }}>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            {`${percent}%`}
          </Typography>
        </Box>
      </Grid>
    </>
  );
};

export default SegmentedProgressBar; 