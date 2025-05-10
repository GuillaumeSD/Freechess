import { getCapturedPieces, getMaterialDifference } from "@/lib/chess";
import { Color } from "@/types/enums";
import { Grid2 as Grid, Typography } from "@mui/material";
import { CSSProperties, useMemo } from "react";

export interface Props {
  fen: string;
  color: Color;
}

const PIECE_SCALE = 0.55;

export default function CapturedPieces({ fen, color }: Props) {
  const cssProps = useMemo(() => {
    const capturedPieces = getCapturedPieces(fen, color);
    return getCapturedPiecesCSSProps(capturedPieces, color);
  }, [fen, color]);

  const materialDiff = useMemo(() => {
    const materialDiff = getMaterialDifference(fen);
    return color === Color.White ? materialDiff : -materialDiff;
  }, [fen, color]);

  return (
    <Grid container alignItems="end" columnGap={0.5} size="auto">
      {cssProps.map((cssProp, i) => (
        <span
          key={i}
          style={{
            ...cssProp,
            backgroundSize: `${34.2 * PIECE_SCALE}rem ${30.6 * PIECE_SCALE}rem`,
            backgroundImage: "url(/captured-pieces.png)",
            backgroundRepeat: "no-repeat",
            display: "inline-block",
          }}
        />
      ))}

      {materialDiff > 0 && (
        <Typography
          lineHeight={`${PIECE_SCALE * 1.5}rem`}
          fontSize={`${PIECE_SCALE * 1.5}rem`}
          marginLeft={0.3}
        >
          +{materialDiff}
        </Typography>
      )}
    </Grid>
  );
}

const getCapturedPiecesCSSProps = (
  capturedPieces: Record<string, number | undefined>,
  color: Color
): CSSProperties[] => {
  const cssProps: CSSProperties[] = [];

  if (color === Color.Black) {
    if (capturedPieces.P) {
      cssProps.push({
        backgroundPositionX: `-${18 * PIECE_SCALE}rem`,
        backgroundPositionY: `${
          -20.1 * PIECE_SCALE + capturedPieces.P * 2.5 * PIECE_SCALE
        }rem`,
        width: `${0.6 * PIECE_SCALE + capturedPieces.P * 0.7 * PIECE_SCALE}rem`,
        height: `${1.7 * PIECE_SCALE}rem`,
      });
    }

    if (capturedPieces.B) {
      cssProps.push({
        backgroundPosition: `-${24.7 * PIECE_SCALE}rem ${
          -5.1 * PIECE_SCALE + capturedPieces.B * 2.6 * PIECE_SCALE
        }rem`,
        width: `${0.7 * PIECE_SCALE + capturedPieces.B * 0.8 * PIECE_SCALE}rem`,
        height: `${
          1.7 * PIECE_SCALE + capturedPieces.B * 0.1 * PIECE_SCALE
        }rem`,
      });
    }

    if (capturedPieces.N) {
      cssProps.push({
        backgroundPosition: `-${27.5 * PIECE_SCALE}rem ${
          -4.9 * PIECE_SCALE + capturedPieces.N * 2.5 * PIECE_SCALE
        }rem`,
        width: `${0.9 * PIECE_SCALE + capturedPieces.N * 0.7 * PIECE_SCALE}rem`,
        height: `${1.9 * PIECE_SCALE}rem`,
      });
    }

    if (capturedPieces.R) {
      cssProps.push({
        backgroundPosition: `${
          -30.2 * PIECE_SCALE + capturedPieces.R * 0.1 * PIECE_SCALE
        }rem ${-5.1 * PIECE_SCALE + capturedPieces.R * 2.5 * PIECE_SCALE}rem`,
        width: `${0.7 * PIECE_SCALE + capturedPieces.R * 0.8 * PIECE_SCALE}rem`,
        height: `${1.7 * PIECE_SCALE}rem`,
      });
    }

    if (capturedPieces.Q) {
      cssProps.push({
        backgroundPosition: `-${32.5 * PIECE_SCALE}rem ${0.1 * PIECE_SCALE}rem`,
        width: `${1.8 * PIECE_SCALE}rem`,
        height: `${1.9 * PIECE_SCALE}rem`,
      });
    }
  } else {
    if (capturedPieces.p) {
      cssProps.push({
        backgroundPositionX: 0,
        backgroundPositionY: `${
          -20.1 * PIECE_SCALE + capturedPieces.p * 2.5 * PIECE_SCALE
        }rem`,
        width: `${0.6 * PIECE_SCALE + capturedPieces.p * 0.7 * PIECE_SCALE}rem`,
        height: `${1.7 * PIECE_SCALE}rem`,
      });
    }

    if (capturedPieces.b) {
      cssProps.push({
        backgroundPosition: `-${6.7 * PIECE_SCALE}rem ${
          -5.1 * PIECE_SCALE + capturedPieces.b * 2.6 * PIECE_SCALE
        }rem`,
        width: `${0.7 * PIECE_SCALE + capturedPieces.b * 0.8 * PIECE_SCALE}rem`,
        height: `${
          1.7 * PIECE_SCALE + capturedPieces.b * 0.1 * PIECE_SCALE
        }rem`,
      });
    }

    if (capturedPieces.n) {
      cssProps.push({
        backgroundPosition: `-${9.5 * PIECE_SCALE}rem ${
          -4.9 * PIECE_SCALE + capturedPieces.n * 2.5 * PIECE_SCALE
        }rem`,
        width: `${0.9 * PIECE_SCALE + capturedPieces.n * 0.7 * PIECE_SCALE}rem`,
        height: `${1.9 * PIECE_SCALE}rem`,
      });
    }

    if (capturedPieces.r) {
      cssProps.push({
        backgroundPosition: `${
          -12.2 * PIECE_SCALE + capturedPieces.r * 0.1 * PIECE_SCALE
        }rem ${-5.1 * PIECE_SCALE + capturedPieces.r * 2.5 * PIECE_SCALE}rem`,
        width: `${0.7 * PIECE_SCALE + capturedPieces.r * 0.8 * PIECE_SCALE}rem`,
        height: `${1.7 * PIECE_SCALE}rem`,
      });
    }

    if (capturedPieces.q) {
      cssProps.push({
        backgroundPosition: `-${14.5 * PIECE_SCALE}rem ${0.1 * PIECE_SCALE}rem`,
        width: `${1.8 * PIECE_SCALE}rem`,
        height: `${1.9 * PIECE_SCALE}rem`,
      });
    }
  }

  return cssProps;
};
