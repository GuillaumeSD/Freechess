import "@lichess-org/chessground/assets/chessground.base.css";
import "./boardStyles.css";

import { useEffect, useRef, useState, CSSProperties } from "react";
import { Chessground as ChessgroundApi } from "@lichess-org/chessground";
import { Api } from "@lichess-org/chessground/api";
import { Config } from "@lichess-org/chessground/config";
import { styled } from "@mui/material";
import { PIECE_SETS } from "@/constants";

interface Props {
  size?: number;
  config?: Config;
  pieceSet?: (typeof PIECE_SETS)[number];
  hue?: number;
}

function Chessground({ size, config, pieceSet, hue }: Props) {
  const [api, setApi] = useState<Api | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref?.current && !api) {
      const chessgroundApi = ChessgroundApi(ref.current, config);
      setApi(chessgroundApi);
    } else if (ref?.current && api && config) {
      api.set(config);
    }
  }, [ref, api, config]);

  useEffect(() => {
    for (const pieceCode of PIECE_CODES) {
      document.body.style.setProperty(
        `--${pieceCode}`,
        `url(/piece/${pieceSet}/${pieceCode}.svg)`
      );
    }
  }, [pieceSet]);

  return (
    <div
      style={{
        height: 0,
        width: size ?? "100%",
        paddingBottom: size ? `${size}px` : "100%",
        position: "relative",
        display: "block",
        filter: `hue-rotate(${hue}deg)`,
      }}
    >
      <StyledBoardContainer
        ref={ref}
        style={
          {
            height: "100%",
            width: "100%",
            position: "absolute",
          } as CSSProperties
        }
      />
    </div>
  );
}

export default Chessground;

const StyledBoardContainer = styled("div")({
  "cg-board": {
    backgroundImage: 'url("/chessboard-background.png")',
    borderRadius: "5px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
  },
  coords: {
    userSelect: "none",
    position: "absolute",
    display: "flex",
    pointerEvents: "none",
    fontWeight: "bold",
  },
  "coords.ranks": {
    flexFlow: "column-reverse",
    top: "0px",
    left: "4px",
    height: "100%",
    width: "1rem",
  },
  "coords.files": {
    bottom: "0px",
    left: "0px",
    width: "100%",
    height: "1.7rem",
    textTransform: "lowercase",
    textAlign: "right",
  },
  coord: {
    transform: "none !important",
    fontSize: "1.2rem",
    fontWeight: 400,
    paddingRight: "0.3rem",
  },
} satisfies Record<string, CSSProperties>);

export const PIECE_CODES = [
  "wP",
  "wB",
  "wN",
  "wR",
  "wQ",
  "wK",
  "bP",
  "bB",
  "bN",
  "bR",
  "bQ",
  "bK",
] as const;
