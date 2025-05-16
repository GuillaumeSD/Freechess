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
import { useSetAtom } from "jotai";
import { boardOrientationAtom } from "../analysis/states";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

interface Props {
  onSelect: (pgn: string) => void;
}

export default function ChessComInput({ onSelect }: Props) {
  const [rawStoredValue, setStoredValues] = useLocalStorage<string[] | string>(
    "chesscom-username",
    []
  );

  const storedValues = useMemo(() => {
    if (Array.isArray(rawStoredValue)) return rawStoredValue;
    if (typeof rawStoredValue === "string") return [rawStoredValue];
    return [];
  }, [rawStoredValue]);

  const [inputValue, setInputValue] = useState("");
  const [hasEdited, setHasEdited] = useState(false);

  useEffect(() => {
    if (!hasEdited && storedValues && storedValues.length > 0 && !inputValue) {
      setInputValue(storedValues[0]);
    }
  }, [storedValues, hasEdited, inputValue]);

  const updateHistory = (username: string) => {
    const trimmed = username.trim();
    if (!trimmed) return;
    const lower = trimmed.toLowerCase();
    const exists =
      storedValues && storedValues.some((u) => u.toLowerCase() === lower);
    if (!exists) {
      setStoredValues([
        trimmed,
        ...(storedValues ? storedValues.filter((u) => u !== trimmed) : []),
      ]);
    }
  };

  const deleteUsername = (usernameToDelete: string) => {
    if (storedValues) {
      const updated = storedValues.filter((u) => u !== usernameToDelete);
      setStoredValues(updated);
    }
  };

  const handleChange = (_: React.SyntheticEvent, newValue: string | null) => {
    const value = newValue ?? "";
    setInputValue(value);
  };

  const handleInputChange = (
    _: React.SyntheticEvent,
    newInputValue: string
  ) => {
    setInputValue(newInputValue);
    if (!hasEdited) setHasEdited(true);
  };
  const debouncedUsername = useDebounce(inputValue, 300);
  const setBoardOrientation = useSetAtom(boardOrientationAtom);

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
          inputValue={inputValue}
          onInputChange={handleInputChange}
          onChange={handleChange}
          renderOption={(props, option) => (
            <li
              {...props}
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
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Enter your Chess.com username..."
              variant="outlined"
            />
          )}
        />
      </FormControl>

      {inputValue && (
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
                  updateHistory(inputValue);
                  setBoardOrientation(
                    inputValue.toLowerCase() !==
                      game.black?.username?.toLowerCase()
                  );
                  onSelect(game.pgn);
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
