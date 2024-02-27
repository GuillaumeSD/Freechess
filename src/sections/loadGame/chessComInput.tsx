import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getUserRecentGames } from "@/lib/chessCom";
import { capitalize } from "@/lib/helpers";
import { ChessComGame } from "@/types/chessCom";
import {
  FormControl,
  Grid,
  ListItemButton,
  ListItemText,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

interface Props {
  pgn: string;
  setPgn: (pgn: string) => void;
}

export default function ChessComInput({ pgn, setPgn }: Props) {
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
        const games = await getUserRecentGames(chessComUsername);
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
      <FormControl sx={{ m: 1, width: 600 }}>
        <TextField
          label="Enter your Chess.com username..."
          variant="outlined"
          value={chessComUsername ?? ""}
          onChange={(e) => setChessComUsername(e.target.value)}
        />
      </FormControl>

      {games.length > 0 && (
        <Grid
          container
          item
          xs={12}
          gap={2}
          justifyContent="center"
          alignContent="center"
        >
          {games.map((game) => (
            <ListItemButton
              onClick={() => setPgn(game.pgn)}
              selected={pgn === game.pgn}
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
                primaryTypographyProps={{ noWrap: true }}
                secondaryTypographyProps={{ noWrap: true }}
              />
            </ListItemButton>
          ))}
        </Grid>
      )}
    </>
  );
}
