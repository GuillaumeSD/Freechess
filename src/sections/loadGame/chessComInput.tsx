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
} from "@mui/material";
import { useSetAtom } from "jotai";
import { boardOrientationAtom } from "../analysis/states";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";

interface Props {
  onSelect: (pgn: string) => void;
}

export default function ChessComInput({ onSelect }: Props) {
  const [chessComUsername, setChessComUsername] = useLocalStorage(
    "chesscom-username",
    ""
  );
  const debouncedUsername = useDebounce(chessComUsername, 200);
  const setBoardOrientation = useSetAtom(boardOrientationAtom);

  const {
    data: games,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["CCUserGames", debouncedUsername],
    enabled: !!debouncedUsername,
    queryFn: () => getChessComUserRecentGames(debouncedUsername ?? ""),
  });

  return (
    <>
      <FormControl sx={{ m: 1, width: 300 }}>
        <TextField
          label="Enter your Chess.com username..."
          variant="outlined"
          value={chessComUsername ?? ""}
          onChange={(e) => setChessComUsername(e.target.value)}
        />
      </FormControl>

      {chessComUsername && (
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
                  setBoardOrientation(
                    chessComUsername.toLowerCase() !==
                      game.black.username.toLowerCase()
                  );
                  onSelect(game.pgn);
                }}
                style={{ width: 350, maxWidth: 350 }}
                key={game.uuid}
              >
                <ListItemText
                  primary={`${capitalize(game.white.username) || "White"} (${
                    game.white.rating || "?"
                  }) vs ${capitalize(game.black.username) || "Black"} (${
                    game.black.rating || "?"
                  })`}
                  secondary={`${capitalize(game.time_class)} played at ${new Date(
                    game.end_time * 1000
                  )
                    .toLocaleString()
                    .slice(0, -3)}`}
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
