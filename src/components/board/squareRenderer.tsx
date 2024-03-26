import { CurrentPosition } from "@/types/eval";
import { MoveClassification } from "@/types/enums";
import { PrimitiveAtom, atom, useAtomValue } from "jotai";
import Image from "next/image";
import { CSSProperties, forwardRef } from "react";
import {
  CustomSquareProps,
  Square,
} from "react-chessboard/dist/chessboard/types";

export interface Props {
  currentPositionAtom: PrimitiveAtom<CurrentPosition>;
  clickedSquaresAtom: PrimitiveAtom<Square[]>;
  playableSquaresAtom: PrimitiveAtom<Square[]>;
  showPlayerMoveIconAtom?: PrimitiveAtom<boolean>;
}

export function getSquareRenderer({
  currentPositionAtom,
  clickedSquaresAtom,
  playableSquaresAtom,
  showPlayerMoveIconAtom = atom(false),
}: Props) {
  const squareRenderer = forwardRef<HTMLDivElement, CustomSquareProps>(
    (props, ref) => {
      const { children, square, style } = props;
      const showPlayerMoveIcon = useAtomValue(showPlayerMoveIconAtom);
      const position = useAtomValue(currentPositionAtom);
      const clickedSquares = useAtomValue(clickedSquaresAtom);
      const playableSquares = useAtomValue(playableSquaresAtom);

      const fromSquare = position.lastMove?.from;
      const toSquare = position.lastMove?.to;
      const moveClassification = position?.eval?.moveClassification;

      const highlightSquareStyle: CSSProperties | undefined =
        clickedSquares.includes(square)
          ? rightClickSquareStyle
          : fromSquare === square || toSquare === square
          ? previousMoveSquareStyle(moveClassification)
          : undefined;

      const playableSquareStyle: CSSProperties | undefined =
        playableSquares.includes(square) ? playableSquareStyles : undefined;

      return (
        <div ref={ref} style={{ ...style, position: "relative" }}>
          {children}
          {highlightSquareStyle && <div style={highlightSquareStyle} />}
          {playableSquareStyle && <div style={playableSquareStyle} />}
          {moveClassification && showPlayerMoveIcon && square === toSquare && (
            <Image
              src={`/icons/${moveClassification}.png`}
              alt="move-icon"
              width={40}
              height={40}
              style={{
                position: "absolute",
                top: "max(-15px, -1.8vw)",
                right: "max(-15px, -1.8vw)",
                maxWidth: "3.6vw",
                maxHeight: "3.6vw",
                zIndex: 100,
              }}
            />
          )}
        </div>
      );
    }
  );

  squareRenderer.displayName = "SquareRenderer";

  return squareRenderer;
}

export const moveClassificationColors: Record<MoveClassification, string> = {
  [MoveClassification.Book]: "#d5a47d",
  [MoveClassification.Brilliant]: "#26c2a3",
  [MoveClassification.Great]: "#4099ed",
  [MoveClassification.Best]: "#3aab18",
  [MoveClassification.Excellent]: "#3aab18",
  [MoveClassification.Good]: "#81b64c",
  [MoveClassification.Inaccuracy]: "#f7c631",
  [MoveClassification.Mistake]: "#ffa459",
  [MoveClassification.Blunder]: "#fa412d",
};

const rightClickSquareStyle: CSSProperties = {
  position: "absolute",
  width: "100%",
  height: "100%",
  backgroundColor: "#eb6150",
  opacity: "0.8",
};

const playableSquareStyles: CSSProperties = {
  position: "absolute",
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,.14)",
  padding: "35%",
  backgroundClip: "content-box",
  borderRadius: "50%",
  boxSizing: "border-box",
};

const previousMoveSquareStyle = (
  moveClassification?: MoveClassification
): CSSProperties => ({
  position: "absolute",
  width: "100%",
  height: "100%",
  backgroundColor: moveClassification
    ? moveClassificationColors[moveClassification]
    : "#fad541",
  opacity: 0.5,
});
