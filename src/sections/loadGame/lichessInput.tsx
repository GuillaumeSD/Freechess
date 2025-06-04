"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getLichessUserRecentGames } from "@/lib/lichess";
import {
  CircularProgress,
  FormControl,
  Grid2 as Grid,
  TextField,
  List,
} from "@mui/material";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { LichessGameItem } from "./lichess-game-item";

interface Props {
  onSelect: (pgn: string, boardOrientation?: boolean) => void;
}

// Helper function to normalize Lichess data
const normalizeLichessData = (data: any) => ({
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
  const [lichessUsername, setLichessUsername] = useLocalStorage(
    "lichess-username",
    ""
  );
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
                      const boardOrientation =
                        lichessUsername.toLowerCase() !==
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
