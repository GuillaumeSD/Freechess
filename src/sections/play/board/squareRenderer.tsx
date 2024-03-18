import { clickedSquaresAtom, gameAtom } from "../states";
import { atom, useAtom, useAtomValue } from "jotai";
import { CSSProperties, MouseEventHandler, forwardRef } from "react";
import { CustomSquareProps } from "react-chessboard/dist/chessboard/types";

const rightClickEventSquareAtom = atom<string | null>(null);

const SquareRenderer = forwardRef<HTMLDivElement, CustomSquareProps>(
  (props, ref) => {
    const { children, square, style } = props;
    const game = useAtomValue(gameAtom);
    const [clickedSquares, setClickedSquares] = useAtom(clickedSquaresAtom);
    const [rightClickEventSquare, setRightClickEventSquare] = useAtom(
      rightClickEventSquareAtom
    );

    const lastMove = game.history({ verbose: true }).at(-1);
    const fromSquare = lastMove?.from;
    const toSquare = lastMove?.to;

    const customSquareStyle: CSSProperties | undefined =
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

    const handleSquareLeftClick: MouseEventHandler<HTMLDivElement> = () => {
      setClickedSquares([]);
    };

    const handleSquareRightClick: MouseEventHandler<HTMLDivElement> = (
      event
    ) => {
      if (event.button !== 2) return;

      if (rightClickEventSquare !== square) {
        setRightClickEventSquare(null);
        return;
      }

      setClickedSquares((prev) =>
        prev.includes(square)
          ? prev.filter((s) => s !== square)
          : [...prev, square]
      );
    };

    return (
      <div
        ref={ref}
        style={{ ...style, position: "relative" }}
        onClick={handleSquareLeftClick}
        onMouseDown={(e) => e.button === 2 && setRightClickEventSquare(square)}
        onMouseUp={handleSquareRightClick}
      >
        {children}
        {customSquareStyle && <div style={customSquareStyle} />}
      </div>
    );
  }
);

SquareRenderer.displayName = "CustomSquareRenderer";

export default SquareRenderer;
