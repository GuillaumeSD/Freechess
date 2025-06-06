import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getChessComUserRecentGames } from "@/lib/chessCom";
import {
  CircularProgress,
  FormControl,
  Grid2 as Grid,
  TextField,
  List,
} from "@mui/material";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { ChessComGameItem } from "./chess-com-game-item";
import { ChessComRawGameData, NormalizedGameData } from "@/types/chessCom";

interface Props {
  onSelect: (pgn: string, boardOrientation?: boolean) => void;
}

// Helper function to normalize Chess.com data
const normalizeChessComData = (
  data: ChessComRawGameData
): NormalizedGameData => {
  const timeControl = data.time_control + "s" || "unknown";

  // Todo Convert from seconds to minutes to time + increment seconds

  // Determine result from multiple sources
  let gameResult = "*"; // default to ongoing

  if (data.result) {
    gameResult = data.result;
  } else if (data.white?.result && data.black?.result) {
    if (data.white.result === "win") {
      gameResult = "1-0";
    } else if (data.black.result === "win") {
      gameResult = "0-1";
    } else if (
      (data.white.result === "stalemate" &&
        data.black.result === "stalemate") ||
      (data.white.result === "repetition" &&
        data.black.result === "repetition") ||
      (data.white.result === "insufficient" &&
        data.black.result === "insufficient") ||
      (data.white.result === "50move" && data.black.result === "50move") ||
      (data.white.result === "agreed" && data.black.result === "agreed")
    ) {
      gameResult = "1/2-1/2";
    }
  }

  //* Function to count moves from PGN. Generated from claude..... :)
  const countMovesFromPGN = (pgn: string) => {
    if (!pgn) return 0;

    // Split PGN into lines and find the moves section (after headers)
    const lines = pgn.split("\n");
    let movesSection = "";
    let inMoves = false;

    for (const line of lines) {
      if (line.trim() === "" && !inMoves) {
        inMoves = true;
        continue;
      }
      if (inMoves) {
        movesSection += line + " ";
      }
    }

    // Remove comments in curly braces and square brackets
    movesSection = movesSection
      .replace(/\{[^}]*\}/g, "")
      .replace(/\[[^\]]*\]/g, "");

    // Remove result indicators
    movesSection = movesSection.replace(/1-0|0-1|1\/2-1\/2|\*/g, "");

    // Split by move numbers and count them
    // Match pattern like "1." "58." etc.
    const moveNumbers = movesSection.match(/\d+\./g);

    return moveNumbers ? moveNumbers.length : 0;
  };

  return {
    id: data.uuid || data.url?.split("/").pop() || data.id,
    white: {
      username: data.white?.username || "White",
      rating: data.white?.rating || 0,
      title: data.white?.title,
    },
    black: {
      username: data.black?.username || "Black",
      rating: data.black?.rating || 0,
      title: data.black?.title,
    },
    result: gameResult,
    timeControl: timeControl,
    date: data.end_time
      ? new Date(data.end_time * 1000).toLocaleDateString()
      : new Date().toLocaleDateString(),
    opening: data.opening?.name || data.eco,
    moves: data.pgn ? countMovesFromPGN(data.pgn) : 0,
    url: data.url,
  };
};

export default function ChessComInput({ onSelect }: Props) {
  const [chessComUsername, setChessComUsername] = useLocalStorage(
    "chesscom-username",
    ""
  );
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
            <List sx={{ width: "100%", maxWidth: 800 }}>
              {games.map((game) => {
                const normalizedGame = normalizeChessComData(game);
                const perspectiveUserColor =
                  normalizedGame.white.username.toLowerCase() ===
                  chessComUsername.toLowerCase()
                    ? "white"
                    : "black";

                return (
                  <ChessComGameItem
                    key={game.uuid}
                    {...normalizedGame}
                    perspectiveUserColor={perspectiveUserColor}
                    onClick={() => {
                      const boardOrientation =
                        chessComUsername.toLowerCase() !==
                        game.black?.username?.toLowerCase();
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
