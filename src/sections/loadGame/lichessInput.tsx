"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getLichessUserRecentGames } from "@/lib/lichess";
import {
  CircularProgress,
  FormControl,
  Grid2 as Grid,
  TextField,
  List,
  Autocomplete,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { LichessGameItem } from "./lichess-game-item";
import { LichessRawGameData, NormalizedLichessGameData } from "@/types/lichess";
import { useMemo, useState } from "react";

interface Props {
  onSelect: (pgn: string, boardOrientation?: boolean) => void;
}

// Helper function to normalize Lichess data
const normalizeLichessData = (
  data: LichessRawGameData
): NormalizedLichessGameData => ({
  id: data.id,
  white: {
    username: data.players.white.user?.name || "Anonymous",
    rating: data.players.white.rating,
    title: data.players.white.user?.title,
  },
  black: {
    username: data.players.black.user?.name || "Anonymous",
    rating: data.players.black.rating,
    title: data.players.black.user?.title,
  },
  result:
    data.status === "draw"
      ? "1/2-1/2"
      : data.winner
        ? data.winner === "white"
          ? "1-0"
          : "0-1"
        : "*",
  timeControl: `${Math.floor(data.clock?.initial / 60 || 0)}+${data.clock?.increment || 0}`,
  date: new Date(data.createdAt || data.lastMoveAt).toLocaleDateString(),
  opening: data.opening?.name,
  moves: data.moves?.split(" ").length || 0,
  url: `https://lichess.org/${data.id}`,
});

export default function LichessInput({ onSelect }: Props) {
  const [rawStoredValue, setStoredValues] = useLocalStorage<string>(
    "lichess-username",
    ""
  );
  const [lichessUsername, setLichessUsername] = useState("");
  const [hasEdited, setHasEdited] = useState(false);

  const storedValues = useMemo(() => {
    if (typeof rawStoredValue === "string") {
      return rawStoredValue
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    return [];
  }, [rawStoredValue]);

  if (
    !hasEdited &&
    storedValues.length &&
    lichessUsername.trim().toLowerCase() != storedValues[0].trim().toLowerCase()
  ) {
    setLichessUsername(storedValues[0].trim());
  }

  const updateHistory = (username: string) => {
    const trimmed = username.trim();
    if (!trimmed) return;
    const lower = trimmed.toLowerCase();

    const exists = storedValues.some((u) => u.toLowerCase() === lower);
    if (!exists) {
      const updated = [trimmed, ...storedValues.slice(0, 7)];
      setStoredValues(updated.join(","));
    }
  };

  const deleteUsername = (usernameToDelete: string) => {
    const updated = storedValues.filter((u) => u !== usernameToDelete);
    setStoredValues(updated.join(","));
  };

  const handleChange = (_: React.SyntheticEvent, newValue: string | null) => {
    const newInputValue = newValue ?? "";
    setLichessUsername(newInputValue.trim());
    setHasEdited(true);
  };

  const debouncedUsername = useDebounce(lichessUsername, 500);

  const {
    data: games,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["LichessUserGames", debouncedUsername],
    enabled: !!debouncedUsername,
    queryFn: ({ signal }) =>
      getLichessUserRecentGames(debouncedUsername ?? "", signal),
    retry: 1,
  });

  return (
    <>
      <FormControl sx={{ m: 1, width: 300 }}>
        <Autocomplete
          freeSolo
          options={storedValues}
          inputValue={lichessUsername}
          onInputChange={handleChange}
          onChange={handleChange}
          renderOption={(props, option) => {
            const { key, ...rest } = props;
            return (
              <li
                key={key}
                {...rest}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingRight: 8,
                }}
              >
                <span>{option}</span>
                <Icon
                  icon="mdi:close"
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteUsername(option);
                  }}
                />
              </li>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Enter your Lichess username..."
              variant="outlined"
            />
          )}
        />
      </FormControl>

      {debouncedUsername && (
        <Grid
          container
          gap={2}
          justifyContent="center"
          alignContent="center"
          minHeight={100}
          size={12}
        >
          {isFetching ? (
            <CircularProgress />
          ) : isError ? (
            <span style={{ color: "salmon" }}>
              User not found. Please check your username.
            </span>
          ) : !games?.length ? (
            <span style={{ color: "salmon" }}>
              No games found. Please check your username.
            </span>
          ) : (
            <List sx={{ width: "100%", maxWidth: 800 }}>
              {games.map((game) => {
                const normalizedGame = normalizeLichessData(game);
                const perspectiveUserColor =
                  normalizedGame.white.username.toLowerCase() ===
                  lichessUsername.toLowerCase()
                    ? "white"
                    : "black";

                return (
                  <LichessGameItem
                    key={game.id}
                    {...normalizedGame}
                    perspectiveUserColor={perspectiveUserColor}
                    onClick={() => {
                      updateHistory(debouncedUsername);
                  const boardOrientation =
                    debouncedUsername.toLowerCase() !==
                    game.players?.black?.user?.name?.toLowerCase();
                  onSelect(game.pgn, boardOrientation);
                    }}
                  />
                );
              })}
            </List>
          )}
        </Grid>
      )}
    </>
  );
}
