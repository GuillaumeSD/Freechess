import { LineEval } from "@/types/eval";
import { Box, ListItem, Skeleton, Typography, useTheme } from "@mui/material";
import { useAtomValue } from "jotai";
import { boardAtom } from "../../states";
import { getLineEvalLabel, moveLineUciToSan } from "@/lib/chess";
import localFont from "next/font/local";
import { useChessActions } from "@/hooks/useChessActions";

const myFont = localFont({
  src: "./chess_merida_unicode.ttf",
});

interface Props {
  line: LineEval;
}

export default function LineEvaluation({ line }: Props) {
  const theme = useTheme();
  const board = useAtomValue(boardAtom);
  const { addMoves } = useChessActions(boardAtom);
  const lineLabel = getLineEvalLabel(line);

  const isBlackCp =
    (line.cp !== undefined && line.cp < 0) ||
    (line.mate !== undefined && line.mate < 0);

  const showSkeleton = line.depth < 6;

  const uciToSan = moveLineUciToSan(board.fen());
  const initialTurn = board.turn();
  const isDarkMode = theme.palette.mode === "dark";

  const formatSan = (
    san: string,
    moveIdx: number
  ): { icon?: string; text: string } => {
    const firstChar = san.charAt(0);

    const isPiece = ["K", "Q", "R", "B", "N"].includes(firstChar);
    if (!isPiece) return { text: san };

    const turn = isDarkMode ? initialTurn : initialTurn === "w" ? "b" : "w";
    const moveColor = moveIdx % 2 === 0 ? turn : turn === "w" ? "b" : "w";
    const icon = unicodeMap[firstChar][moveColor];

    return { icon, text: san.slice(1) };
  };

  return (
    <ListItem disablePadding>
      <Typography
        marginRight={1.5}
        marginY={0.3}
        paddingY={0.2}
        noWrap
        overflow="visible"
        width="3.5em"
        minWidth="3.5em"
        textAlign="center"
        fontSize="0.8rem"
        sx={{
          backgroundColor: isBlackCp ? "black" : "white",
          color: isBlackCp ? "white" : "black",
        }}
        borderRadius="5px"
        border="1px solid #424242"
        fontWeight="500"
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

      <Typography noWrap fontSize="0.9rem">
        {showSkeleton ? (
          <Skeleton variant="rounded" animation="wave" width="20em" />
        ) : (
          line.pv.map((uci, i) => {
            const san = uciToSan(uci);
            const { icon, text } = formatSan(san, i);

            return (
              <Box
                component="span"
                key={i}
                onClick={() => {
                  addMoves(line.pv.slice(0, i + 1));
                }}
                sx={{
                  cursor: "pointer",
                  ml: i ? 0.5 : 0,
                  transition: "opacity 0.2s ease-in-out",
                  "&:hover": {
                    opacity: 0.5,
                  },
                }}
              >
                {icon && (
                  <Typography
                    component="span"
                    fontFamily={myFont.style.fontFamily}
                  >
                    {icon}
                  </Typography>
                )}

                <Typography component="span">
                  {text}
                  {i < line.pv.length - 1 && ","}
                </Typography>
              </Box>
            );
          })
        )}
      </Typography>
    </ListItem>
  );
}

const unicodeMap: Record<string, Record<"w" | "b", string>> = {
  K: { w: "♚", b: "♔" },
  Q: { w: "♛", b: "♕" },
  R: { w: "♜", b: "♖" },
  B: { w: "♝", b: "♗" },
  N: { w: "♞", b: "♘" },
};
