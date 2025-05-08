import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getLichessUserRecentGames } from "@/lib/lichess";
import { capitalize } from "@/lib/helpers";
import { LichessGame } from "@/types/lichess";
import {
  CircularProgress,
  FormControl,
  Grid2 as Grid,
  ListItemButton,
  ListItemText,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import { boardOrientationAtom } from "../analysis/states";

interface Props {
  onSelect: (pgn: string) => void;
}

export default function LichessInput({ onSelect }: Props) {
  const [requestCount, setRequestCount] = useState(0);
  const [lichessUsername, setLichessUsername] = useLocalStorage(
    "lichess-username",
    ""
  );
  const setBoardOrientation = useSetAtom(boardOrientationAtom);
  const [games, setGames] = useState<LichessGame[]>([]);

  useEffect(() => {
    if (!lichessUsername) {
      setGames([]);
      return;
    }

    const timeout = setTimeout(
      async () => {
        const games = await getLichessUserRecentGames(lichessUsername);
        setGames(games);
      },
      requestCount === 0 ? 0 : 500
    );

    setRequestCount((prev) => prev + 1);

    return () => {
      clearTimeout(timeout);
    };
  }, [lichessUsername]); // eslint-disable-line react-hooks/exhaustive-deps

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
          {games.map((game) => (
            <ListItemButton
              onClick={() => {
                setBoardOrientation(
                  lichessUsername.toLowerCase() !==
                    game.players.black.user?.name.toLowerCase()
                );
                onSelect(game.pgn);
              }}
              style={{ width: 350, maxWidth: 350 }}
              key={game.id}
            >
              <ListItemText
                primary={`${
                  capitalize(game.players.white.user?.name || "white") ||
                  "White"
                } (${game.players?.white?.rating || "?"}) vs ${
                  capitalize(game.players.black.user?.name || "black") ||
                  "Black"
                } (${game.players?.black?.rating || "?"})`}
                secondary={`${capitalize(game.speed)} played at ${new Date(
                  game.lastMoveAt
                )
                  .toLocaleString()
                  .slice(0, -3)}`}
                slotProps={{
                  primary: { noWrap: true },
                  secondary: { noWrap: true },
                }}
              />
            </ListItemButton>
          ))}

          {games.length === 0 && <CircularProgress />}
        </Grid>
      )}
    </>
  );
}
