import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getChessComUserRecentGames } from "@/lib/chessCom";
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
import { useEffect, useMemo, useState } from "react";

interface Props {
  onSelect: (pgn: string, boardOrientation?: boolean) => void;
}

export default function ChessComInput({ onSelect }: Props) {
  const [rawStoredValue, setStoredValues] = useLocalStorage<string>(
    "chesscom-username",
    ""
  );

  const storedValues = useMemo(() => {
    if (typeof rawStoredValue === "string")
      return rawStoredValue
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    else return [];
  }, [rawStoredValue]);

  const [chessComUsername, setChessComUsername] = useState("");
  const [hasEdited, setHasEdited] = useState(false);

  useEffect(() => {
    if (
      !hasEdited &&
      storedValues &&
      storedValues.length > 0 &&
      chessComUsername.trim().toLowerCase() !=
        storedValues[0].trim().toLowerCase()
    ) {
      setChessComUsername(storedValues[0].trim().toLowerCase());
    }
  }, [storedValues, hasEdited, chessComUsername]);

  const updateHistory = (username: string) => {
    const trimmed = username.trim();
    if (!trimmed) return;
    const lower = trimmed.toLowerCase();

    const exists = storedValues.some((u) => u.toLowerCase() === lower);
    if (!exists) {
      const updated = [trimmed, ...storedValues.filter((u) => u !== trimmed)];
      setStoredValues(updated.join(","));
    }
  };

  const deleteUsername = (usernameToDelete: string) => {
    const updated = storedValues.filter((u) => u !== usernameToDelete);
    setStoredValues(updated.join(","));
  };

  const handleChange = (_: React.SyntheticEvent, newValue: string | null) => {
    const newInputValue = newValue ?? "";
    if (
      newInputValue.trim().toLowerCase() !=
      chessComUsername.trim().toLowerCase()
    )
      setChessComUsername(newInputValue.trim().toLowerCase());
  };

  const handleInputChange = (
    _: React.SyntheticEvent,
    newInputValue: string
  ) => {
    if (
      newInputValue.trim().toLowerCase() !=
      chessComUsername.trim().toLowerCase()
    ) {
      setChessComUsername(newInputValue.trim().toLowerCase());
      if (!hasEdited) setHasEdited(true);
    }
  };
  const debouncedUsername = useDebounce(chessComUsername, 300);

  const {
    data: games,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["CCUserGames", debouncedUsername],
    enabled: !!debouncedUsername,
    queryFn: ({ signal }) =>
      getChessComUserRecentGames(debouncedUsername ?? "", signal),
    retry: 1,
  });

  return (
    <>
      <FormControl sx={{ m: 1, width: 300 }}>
        <Autocomplete
          freeSolo
          options={storedValues}
          inputValue={chessComUsername}
          onInputChange={handleInputChange}
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
              label="Enter your Chess.com username..."
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
                    game.black?.username?.toLowerCase();
                  onSelect(game.pgn, boardOrientation);
                }}
                style={{ width: 350, maxWidth: 350 }}
                key={game.uuid}
              >
                <ListItemText
                  primary={`${capitalize(game.white?.username || "white")} (${
                    game.white?.rating || "?"
                  }) vs ${capitalize(game.black?.username || "black")} (${
                    game.black?.rating || "?"
                  })`}
                  secondary={
                    game.end_time
                      ? `${capitalize(game.time_class || "game")} played at ${new Date(
                          game.end_time * 1000
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
