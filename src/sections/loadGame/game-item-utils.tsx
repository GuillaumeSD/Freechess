import { Icon } from "@iconify/react";
import { Chip, Tooltip, useTheme } from "@mui/material";
import React from "react";

export const GameResult: React.FC<{
  result: string;
  perspectiveUserColor: "white" | "black";
}> = ({ result, perspectiveUserColor }) => {
  const theme = useTheme();

  let color = theme.palette.text.secondary; // Neutral gray for ongoing
  let bgColor = theme.palette.action.hover;
  let icon = <Icon icon="material-symbols:play-circle-outline" />;
  let label = "Game in Progress";

  if (result === "1-0") {
    // White wins
    if (perspectiveUserColor === "white") {
      color = theme.palette.success.main; // Success green
      bgColor = `${theme.palette.success.main}1A`; // 10% opacity
      icon = <Icon icon="material-symbols:emoji-events" />;
    } else {
      // perspectiveUserColor is black
      color = theme.palette.error.main; // Confident red
      bgColor = `${theme.palette.error.main}1A`; // 10% opacity
      icon = <Icon icon="material-symbols:sentiment-dissatisfied" />; // A suitable icon for loss
    }
    label = `White Wins`;
  } else if (result === "0-1") {
    // Black wins
    if (perspectiveUserColor === "black") {
      color = theme.palette.success.main; // Success green
      bgColor = `${theme.palette.success.main}1A`; // 10% opacity
      icon = <Icon icon="material-symbols:emoji-events" />;
    } else {
      // perspectiveUserColor is white
      color = theme.palette.error.main; // Confident red
      bgColor = `${theme.palette.error.main}1A`; // 10% opacity
      icon = <Icon icon="material-symbols:sentiment-dissatisfied" />; // A suitable icon for loss
    }
    label = `Black Wins`;
  } else if (result === "1/2-1/2") {
    color = theme.palette.info.main; // Balanced blue (using info for a neutral, distinct color)
    bgColor = `${theme.palette.info.main}1A`; // 10% opacity
    icon = <Icon icon="material-symbols:handshake" />;
    label = `Draw`;
  }
  return (
    <Tooltip title={label}>
      <Chip
        icon={icon}
        label={result}
        size="small"
        sx={{
          color,
          backgroundColor: bgColor,
          fontWeight: "600",
          minWidth: 65,
          border: `1px solid ${color}20`,
          "& .MuiChip-icon": {
            color: color,
          },
        }}
      />
    </Tooltip>
  );
};

export const TimeControlChip: React.FC<{ timeControl: string }> = ({
  timeControl,
}) => {
  return (
    <Tooltip title="Time Control">
      <Chip
        icon={<Icon icon="material-symbols:timer-outline" />}
        label={timeControl}
        size="small"
      />
    </Tooltip>
  );
};

export const MovesChip: React.FC<{ moves: number }> = ({ moves }) => {
  return (
    <Tooltip title="Number of Moves">
      <Chip
        icon={<Icon icon="material-symbols:flag-2" />}
        label={`${Math.round(moves / 2)} moves`}
        size="small"
      />
    </Tooltip>
  );
};

export const DateChip: React.FC<{ date: string }> = ({ date }) => {
  return (
    <Tooltip title="Date Played">
      <Chip
        icon={<Icon icon="material-symbols:calendar-today" />}
        label={date}
        size="small"
      />
    </Tooltip>
  );
};
