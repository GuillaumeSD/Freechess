import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getChessComUserRecentGames } from "@/lib/chessCom";
import { capitalize } from "@/lib/helpers";
import { ChessComGame } from "@/types/chessCom";
import {
  CircularProgress,
  FormControl,
  Grid2 as Grid,
  ListItemButton,
  ListItemText,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

interface Props {
  onSelect: (pgn: string) => void;
}

export default function ChessComInput({ onSelect }: Props) {
  const [requestCount, setRequestCount] = useState(0);
  const [chessComUsername, setChessComUsername] = useLocalStorage(
    "chesscom-username",
    ""
  );
  const [games, setGames] = useState<ChessComGame[]>([]);

  useEffect(() => {
    if (!chessComUsername) {
      setGames([]);
      return;
    }

    const timeout = setTimeout(
      async () => {
        const games = await getChessComUserRecentGames(chessComUsername);
        setGames(games);
      },
      requestCount === 0 ? 0 : 500
    );

    setRequestCount((prev) => prev + 1);

    return () => {
      clearTimeout(timeout);
    };
  }, [chessComUsername]); // eslint-disable-line react-hooks/exhaustive-deps

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
          {games.map((game) => (
            <ListItemButton
              onClick={() => onSelect(game.pgn)}
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
          ))}

          {games.length === 0 && <CircularProgress />}
        </Grid>
      )}
    </>
  );
}
