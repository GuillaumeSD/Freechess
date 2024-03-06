import { showPlayerMoveIconAtom } from "@/sections/analysis/states";
import { MoveClassification } from "@/types/enums";
import { CurrentPosition } from "@/types/eval";
import { useAtomValue } from "jotai";
import Image from "next/image";
import { CSSProperties, forwardRef, useMemo } from "react";
import { CustomSquareProps } from "react-chessboard/dist/chessboard/types";

export const useSquareRenderer = (position: CurrentPosition) => {
  const showPlayerMoveIcon = useAtomValue(showPlayerMoveIconAtom);

  const CustomSquareRenderer = useMemo(() => {
    const fromSquare = position.lastMove?.from;
    const toSquare = position.lastMove?.to;
    const moveClassification = position?.eval?.moveClassification;

    if (!showPlayerMoveIcon || !moveClassification || !fromSquare || !toSquare)
      return undefined;

    const squareRenderer = forwardRef<HTMLDivElement, CustomSquareProps>(
      (props, ref) => {
        const { children, square, style } = props;

        const customSquareStyle: CSSProperties | undefined =
          fromSquare === square || toSquare === square
            ? {
                position: "absolute",
                width: "100%",
                height: "100%",
                backgroundColor: moveClassificationColors[moveClassification],
                opacity: 0.5,
              }
            : undefined;

        return (
          <div ref={ref} style={{ ...style, position: "relative" }}>
            {children}
            {customSquareStyle && <div style={customSquareStyle} />}
            {square === toSquare && (
              <Image
                src={`/icons/${moveClassification}.png`}
                alt="move-icon"
                width={40}
                height={40}
                style={{
                  position: "absolute",
                  top: -12,
                  right: -12,
                }}
              />
            )}
          </div>
        );
      }
    );

    squareRenderer.displayName = "CustomSquareRenderer";

    return squareRenderer;
  }, [showPlayerMoveIcon, position]);

  return CustomSquareRenderer;
};

export const moveClassificationColors: Record<MoveClassification, string> = {
  [MoveClassification.Best]: "#3aab18",
  [MoveClassification.Book]: "#d5a47d",
  [MoveClassification.Excellent]: "#3aab18",
  [MoveClassification.Good]: "#81b64c",
  [MoveClassification.Inaccuracy]: "#f7c631",
  [MoveClassification.Mistake]: "#ffa459",
  [MoveClassification.Blunder]: "#fa412d",
};
