import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getLichessUserRecentGames } from "@/lib/lichess";
import { capitalize } from "@/lib/helpers";
import {
  CircularProgress,
  FormControl,
  Grid2 as Grid,
  ListItemButton,
  ListItemText,
  TextField,
  Autocomplete,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

interface Props {
  onSelect: (pgn: string, boardOrientation?: boolean) => void;
}

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
            games.map((game) => (
              <ListItemButton
                onClick={() => {
                  updateHistory(debouncedUsername);
                  const boardOrientation =
                    debouncedUsername.toLowerCase() !==
                    game.players?.black?.user?.name?.toLowerCase();
                  onSelect(game.pgn, boardOrientation);
                }}
                style={{ width: 350, maxWidth: 350 }}
                key={game.id}
              >
                <ListItemText
                  primary={`${
                    capitalize(game.players?.white?.user?.name || "white") ||
                    "White"
                  } (${game.players?.white?.rating || "?"}) vs ${
                    capitalize(game.players?.black?.user?.name || "black") ||
                    "Black"
                  } (${game.players?.black?.rating || "?"})`}
                  secondary={
                    game.lastMoveAt
                      ? `${capitalize(game.speed || "game")} played at ${new Date(
                          game.lastMoveAt
                        )
                          .toLocaleString()
                          .slice(0, -3)}`
                      : undefined
                  }
                  slotProps={{
                    primary: { noWrap: true },
                    secondary: { noWrap: true },
                  }}
                />
              </ListItemButton>
            ))
          )}
        </Grid>
      )}
    </>
  );
}
