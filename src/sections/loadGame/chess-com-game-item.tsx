import type React from "react";
import {
  ListItem,
  ListItemText,
  Typography,
  Box,
  useTheme,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Icon } from "@iconify/react";
import {
  DateChip,
  GameResult,
  MovesChip,
  TimeControlChip,
} from "./game-item-utils";

type ChessComPlayer = {
  username: string;
  rating: number;
  title?: string;
};

type ChessComGameProps = {
  id: string;
  white: ChessComPlayer;
  black: ChessComPlayer;
  result: string;
  timeControl: string;
  date: string;
  opening?: string;
  moves?: number;
  url: string;
  onClick?: () => void;
  perspectiveUserColor: "white" | "black";
};


export const ChessComGameItem: React.FC<ChessComGameProps> = ({
  white,
  black,
  result,
  timeControl,
  date,
  moves,
  url,
  onClick,
  perspectiveUserColor,
}) => {
  const theme = useTheme();

  const formatPlayerName = (player: ChessComPlayer) => {
    return player.title
      ? `${player.title} ${player.username}`
      : player.username;
  };

  const whiteWon = result === "1-0";
  const blackWon = result === "0-1";

  return (
    <ListItem
      alignItems="flex-start"
      sx={{
        borderRadius: 2,
        mb: 1.5,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          backgroundColor: theme.palette.action.hover,
          transform: "translateY(-1px)",
          boxShadow: theme.shadows[3],
        },
        border: `1px solid ${theme.palette.divider}`,
        cursor: onClick ? "pointer" : "default",
        // background: theme.palette.background.paper,
      }}
      onClick={onClick}
    >
      <ListItemText
        primary={
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1.5,
              mb: 1,
            }}
          >
            <Typography
              variant="subtitle1"
              component="span"
              sx={{
                fontWeight: "700",
                color: whiteWon
                  ? theme.palette.success.main
                  : theme.palette.text.primary,
                opacity: blackWon ? 0.7 : 1,
              }}
            >
              {formatPlayerName(white)} ({white.rating})
            </Typography>

            <Typography
              variant="body2"
              component="span"
              sx={{ color: theme.palette.text.secondary, fontWeight: "500" }}
            >
              vs
            </Typography>

            <Typography
              variant="subtitle1"
              component="span"
              sx={{
                fontWeight: "700",
                color: blackWon
                  ? theme.palette.success.main
                  : theme.palette.text.primary,
                opacity: whiteWon ? 0.7 : 1,
              }}
            >
              {formatPlayerName(black)} ({black.rating})
            </Typography>

            <GameResult
              result={result}
              perspectiveUserColor={perspectiveUserColor}
            />
          </Box>
        }
        secondary={
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              alignItems: "center",
            }}
          >
            <TimeControlChip timeControl={timeControl} />
            {moves && moves > 0 && <MovesChip moves={moves} />}
            <DateChip date={date} />
          </Box>
        }
        sx={{ mr: 2 }}
      />

      <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
        <Tooltip title="View on Chess.com">
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              window.open(url, "_blank");
            }}
            size="small"
            sx={{
              color: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
                transform: "scale(1.1)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            <Icon icon="material-symbols:open-in-new" />
          </IconButton>
        </Tooltip>
      </Box>
    </ListItem>
  );
};
