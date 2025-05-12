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
} from "@mui/material";
import { useSetAtom } from "jotai";
import { boardOrientationAtom } from "../analysis/states";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";

interface Props {
  onSelect: (pgn: string) => void;
}

export default function LichessInput({ onSelect }: Props) {
  const [lichessUsername, setLichessUsername] = useLocalStorage(
    "lichess-username",
    ""
  );
  const debouncedUsername = useDebounce(lichessUsername, 500);
  const setBoardOrientation = useSetAtom(boardOrientationAtom);

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
        <TextField
          label="Enter your Lichess username..."
          variant="outlined"
          value={lichessUsername ?? ""}
          onChange={(e) => setLichessUsername(e.target.value)}
        />
      </FormControl>

      {lichessUsername && (
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
                    lichessUsername.toLowerCase() !==
                      game.players?.black?.user?.name?.toLowerCase()
                  );
                  onSelect(game.pgn);
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
