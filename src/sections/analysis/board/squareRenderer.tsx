import { currentPositionAtom, showPlayerMoveIconAtom } from "../states";
import { MoveClassification } from "@/types/enums";
import { useAtomValue } from "jotai";
import Image from "next/image";
import { CSSProperties, forwardRef } from "react";
import { CustomSquareProps } from "react-chessboard/dist/chessboard/types";

const SquareRenderer = forwardRef<HTMLDivElement, CustomSquareProps>(
  (props, ref) => {
    const { children, square, style } = props;
    const showPlayerMoveIcon = useAtomValue(showPlayerMoveIconAtom);
    const position = useAtomValue(currentPositionAtom);

    const fromSquare = position.lastMove?.from;
    const toSquare = position.lastMove?.to;
    const moveClassification = position?.eval?.moveClassification;

    const customSquareStyle: CSSProperties | undefined =
      fromSquare === square || toSquare === square
        ? {
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: moveClassification
              ? moveClassificationColors[moveClassification]
              : "#ffff33",
            opacity: 0.5,
          }
        : undefined;

    return (
      <div ref={ref} style={{ ...style, position: "relative" }}>
        {children}
        {customSquareStyle && <div style={customSquareStyle} />}
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
            }}
          />
        )}
      </div>
    );
  }
);

SquareRenderer.displayName = "CustomSquareRenderer";

export default SquareRenderer;

export const moveClassificationColors: Record<MoveClassification, string> = {
  [MoveClassification.Best]: "#3aab18",
  [MoveClassification.Book]: "#d5a47d",
  [MoveClassification.Excellent]: "#3aab18",
  [MoveClassification.Good]: "#81b64c",
  [MoveClassification.Inaccuracy]: "#f7c631",
  [MoveClassification.Mistake]: "#ffa459",
  [MoveClassification.Blunder]: "#fa412d",
};
