import { clickedSquaresAtom, gameAtom, playableSquaresAtom } from "../states";
import { useAtomValue } from "jotai";
import { CSSProperties, forwardRef } from "react";
import { CustomSquareProps } from "react-chessboard/dist/chessboard/types";

const SquareRenderer = forwardRef<HTMLDivElement, CustomSquareProps>(
  (props, ref) => {
    const { children, square, style } = props;
    const game = useAtomValue(gameAtom);
    const clickedSquares = useAtomValue(clickedSquaresAtom);
    const playableSquares = useAtomValue(playableSquaresAtom);

    const lastMove = game.history({ verbose: true }).at(-1);
    const fromSquare = lastMove?.from;
    const toSquare = lastMove?.to;

    const highlightSquareStyle: CSSProperties | undefined =
      clickedSquares.includes(square)
        ? {
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "#eb6150",
            opacity: "0.8",
          }
        : fromSquare === square || toSquare === square
        ? {
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "#fad541",
            opacity: 0.5,
          }
        : undefined;

    const playableSquareStyle: CSSProperties | undefined =
      playableSquares.includes(square)
        ? {
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,.14)",
            padding: "35%",
            backgroundClip: "content-box",
            borderRadius: "50%",
            boxSizing: "border-box",
          }
        : undefined;

    return (
      <div ref={ref} style={{ ...style, position: "relative" }}>
        {children}
        {highlightSquareStyle && <div style={highlightSquareStyle} />}
        {playableSquareStyle && <div style={playableSquareStyle} />}
      </div>
    );
  }
);

SquareRenderer.displayName = "CustomSquareRenderer";

export default SquareRenderer;
