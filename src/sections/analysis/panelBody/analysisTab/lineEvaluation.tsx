import { LineEval } from "@/types/eval";
import { ListItem, Skeleton, Typography, Box } from "@mui/material";
import { useAtomValue } from "jotai";
import { boardAtom, gameAtom } from "../../states";
import { getLineEvalLabel, moveLineUciToSan, uciMoveParams } from "@/lib/chess";
import { useChessActions } from "@/hooks/useChessActions";
import { Chess } from "chess.js";

interface Props {
  line: LineEval;
}

export default function LineEvaluation({ line }: Props) {
  const board = useAtomValue(boardAtom);
  const { setPgn: setBoardPgn } = useChessActions(boardAtom);
  const { setPgn: setGamePgn } = useChessActions(gameAtom);
  const lineLabel = getLineEvalLabel(line);

  const isBlackCp =
    (line.cp !== undefined && line.cp < 0) ||
    (line.mate !== undefined && line.mate < 0);

  const showSkeleton = line.depth < 6;

  // Prepare unicode icons for all pieces (including pawns) based on turn
  const initialTurn = new Chess(board.fen()).turn();
  const unicodeMap: Record<string, Record<"w" | "b", string>> = {
    K: { w: "♔", b: "♚" },
    Q: { w: "♕", b: "♛" },
    R: { w: "♖", b: "♜" },
    B: { w: "♗", b: "♝" },
    N: { w: "♘", b: "♞" },
  };

  return (
    <ListItem disablePadding>
      <Typography
        marginRight={1.5}
        marginY={0.5}
        paddingY={0.2}
        noWrap
        overflow="visible"
        width="3.5em"
        textAlign="center"
        fontSize="0.8rem"
        sx={{
          backgroundColor: isBlackCp ? "black" : "white",
          color: isBlackCp ? "white" : "black",
        }}
        borderRadius="5px"
        border="1px solid #424242"
        fontWeight="bold"
      >
        {showSkeleton ? (
          <Skeleton
            variant="rounded"
            animation="wave"
            sx={{ color: "transparent" }}
          >
            placeholder
          </Skeleton>
        ) : (
          lineLabel
        )}
      </Typography>

      <Typography
        noWrap
        maxWidth={{ xs: "12em", sm: "25em", md: "30em", lg: "25em" }}
        fontSize="0.9rem"
      >
        {showSkeleton ? (
          <Skeleton variant="rounded" animation="wave" width="15em" />
        ) : (
          <Box component="span">
            {line.pv.map((uci, i) => {
              const san = moveLineUciToSan(board.fen())(uci);
              // Map SAN to Unicode icon + move text
              const firstChar = san.charAt(0);
              const isPiece = ["K", "Q", "R", "B", "N"].includes(firstChar);
              const pieceType = isPiece ? firstChar : "";
              const sanSuffix = isPiece ? san.slice(1) : san;
              let moveColor: "w" | "b";
              if (i % 2 === 0) {
                moveColor = initialTurn;
              } else {
                moveColor = initialTurn === "w" ? "b" : "w";
              }
              const icon = pieceType ? unicodeMap[pieceType][moveColor] : "";
              const displaySan = `${icon}${sanSuffix}`;
              return (
                <Box
                  component="span"
                  key={i}
                  onClick={() => {
                    // Clone current board position and replay PV moves
                    const clone = new Chess(board.fen());
                    for (let j = 0; j <= i; j++) {
                      const uciMove = line.pv[j];
                      const params = uciMoveParams(uciMove);
                      // handle non-standard castling UCI
                      if (params.from === "e1" && params.to === "h1") {
                        params.to = "g1";
                      } else if (params.from === "e8" && params.to === "h8") {
                        params.to = "g8";
                      }
                      const mv = clone.move(params);
                      if (!mv) {
                        console.error(`Illegal PV move ${j}: ${uciMove}`);
                        return; // abort on illegal move
                      }
                    }
                    // Persist the updated PGN back into both atoms
                    const newPgn = clone.pgn();
                    setGamePgn(newPgn);
                    setBoardPgn(newPgn);
                  }}
                  sx={{
                    cursor: "pointer",
                    mr: i < line.pv.length - 1 ? 0.5 : 0,
                    transition: "opacity 0.2s ease-in-out",
                    "&:hover": {
                      opacity: 0.5,
                    },
                  }}
                >
                  {displaySan}
                  {i < line.pv.length - 1 && ","}
                </Box>
              );
            })}
          </Box>
        )}
      </Typography>
    </ListItem>
  );
}
