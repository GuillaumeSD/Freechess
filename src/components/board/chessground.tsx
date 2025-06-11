import React, { useEffect, useRef, useState } from "react";
import { Chessground as ChessgroundApi } from "@lichess-org/chessground";
import { Api } from "@lichess-org/chessground/api";
import { Config } from "@lichess-org/chessground/config";
import "@lichess-org/chessground/assets/chessground.base.css";
import "@lichess-org/chessground/assets/chessground.brown.css";
import "@lichess-org/chessground/assets/chessground.cburnett.css";
import { styled } from "@mui/material";

interface Props {
  size?: number;
  config?: Config;
}

function Chessground({ size, config }: Props) {
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

  return (
    <div
      style={{
        height: 0,
        width: size ?? "100%",
        paddingBottom: size ? `${size}px` : "100%",
        position: "relative",
        // gridArea: "board",
        display: "block",
      }}
    >
      <StyledBoardContainer
        ref={ref}
        style={{ height: "100%", width: "100%", position: "absolute" }}
      />
    </div>
  );
}

export default Chessground;

const StyledBoardContainer = styled("div")({
  "cg-board": {
    backgroundImage: 'url("chessboard-background.png")',
  },
});

// const StyledBoardContainer = styled("div")({
//   ".cg-wrap": {
//     "box-sizing": "content-box",
//     position: "relative",
//     display: "block",
//   },
//   "cg-container": {
//     position: "absolute",
//     width: "100%",
//     height: "100%",
//     display: "block",
//     top: 0,
//   },
//   "cg-board": {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: "100%",
//     "-webkit-user-select": "none",
//     "-moz-user-select": "none",
//     "-ms-user-select": "none",
//     userSelect: "none",
//     lineHeight: 0,
//     backgroundSize: "cover",
//     backgroundColor: "#f0d9b5",
//     backgroundImage: `url(
//       "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4PSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIgogICAgIHZpZXdCb3g9IjAgMCA4IDgiIHNoYXBlLXJlbmRlcmluZz0iY3Jpc3BFZGdlcyI+CjxnIGlkPSJhIj4KICA8ZyBpZD0iYiI+CiAgICA8ZyBpZD0iYyI+CiAgICAgIDxnIGlkPSJkIj4KICAgICAgICA8cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBpZD0iZSIgb3BhY2l0eT0iMCIvPgogICAgICAgIDx1c2UgeD0iMSIgeT0iMSIgaHJlZj0iI2UiIHg6aHJlZj0iI2UiLz4KICAgICAgICA8cmVjdCB5PSIxIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBpZD0iZiIgb3BhY2l0eT0iMC4yIi8+CiAgICAgICAgPHVzZSB4PSIxIiB5PSItMSIgaHJlZj0iI2YiIHg6aHJlZj0iI2YiLz4KICAgICAgPC9nPgogICAgICA8dXNlIHg9IjIiIGhyZWY9IiNkIiB4OmhyZWY9IiNkIi8+CiAgICA8L2c+CiAgICA8dXNlIHg9IjQiIGhyZWY9IiNjIiB4OmhyZWY9IiNjIi8+CiAgPC9nPgogIDx1c2UgeT0iMiIgaHJlZj0iI2IiIHg6aHJlZj0iI2IiLz4KPC9nPgo8dXNlIHk9IjQiIGhyZWY9IiNhIiB4OmhyZWY9IiNhIi8+Cjwvc3ZnPg=="
//     )`,
//   },
//   ".cg-wrap.manipulable cg-board": {
//     cursor: "pointer",
//   },
//   "cg-board square": {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     width: "12.5%",
//     height: "12.5%",
//     pointerEvents: "none",
//   },
//   "cg-board square.move-dest": {
//     pointerEvents: "auto",
//   },
//   "cg-board square.last-move": {
//     willChange: "transform",
//   },
//   ".cg-wrap piece": {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     width: "12.5%",
//     height: "12.5%",
//     backgroundSize: "cover",
//     zIndex: 2,
//     willChange: "transform",
//     pointerEvents: "none",
//   },
//   "cg-board piece.dragging": {
//     cursor: "move",
//     zIndex: 11, // !important to override z-index from 3D piece inline style
//   },
//   "piece.anim": {
//     zIndex: 8,
//   },
//   "piece.fading": {
//     zIndex: 1,
//     opacity: 0.5,
//   },
//   ".cg-wrap piece.ghost": {
//     opacity: 0.3,
//   },
//   ".cg-wrap piece svg": {
//     overflow: "hidden",
//     position: "relative",
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: "100%",
//     pointerEvents: "none",
//     zIndex: 2,
//     opacity: 0.6,
//   },
//   ".cg-wrap cg-auto-pieces, .cg-wrap .cg-shapes, .cg-wrap .cg-custom-svgs": {
//     overflow: "visible",
//     position: "absolute",
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: "100%",
//     pointerEvents: "none",
//   },
//   ".cg-wrap cg-auto-pieces": {
//     zIndex: 2,
//   },
//   ".cg-wrap cg-auto-pieces piece": {
//     opacity: 0.3,
//   },
//   ".cg-wrap .cg-shapes": {
//     overflow: "hidden",
//     opacity: 0.6,
//     zIndex: 2,
//   },
//   ".cg-wrap .cg-custom-svgs": {
//     // over piece.anim = 8, but under piece.dragging = 11
//     zIndex: 9,
//   },
//   ".cg-wrap .cg-custom-svgs svg": {
//     overflow: "visible",
//   },
//   ".cg-wrap coords": {
//     position: "absolute",
//     display: "flex",
//     pointerEvents: "none",
//     opacity: 0.8,
//     fontFamily: "sans-serif",
//     fontSize: "9px",
//   },
//   ".cg-wrap coords.ranks": {
//     left: "4px",
//     top: "-20px",
//     flexFlow: "column-reverse",
//     height: "100%",
//     width: "12px",
//   },
//   ".cg-wrap coords.ranks.black": {
//     flexFlow: "column",
//   },
//   ".cg-wrap coords.ranks.left": {
//     left: "-15px",
//     alignItems: "flex-end",
//   },
//   ".cg-wrap coords.files": {
//     bottom: "-4px",
//     left: "24px",
//     flexFlow: "row",
//     width: "100%",
//     height: "16px",
//     textTransform: "uppercase",
//     textAlign: "center",
//   },
//   ".cg-wrap coords.files.black": {
//     flexFlow: "row-reverse",
//   },
//   ".cg-wrap coords.coord": {
//     flex: "1 1 auto",
//   },
//   ".cg-wrap coords.ranks coord": {
//     transform: "translateY(39%)",
//   },
//   ".cg-wrap coords.squares": {
//     bottom: 0,
//     left: 0,
//     textTransform: "uppercase",
//     textAlign: "right",
//     flexFlow: "column-reverse",
//     height: "100%",
//     width: "12.5%",
//   },
//   ".cg-wrap coords.squares.black": {
//     flexFlow: "column",
//   },
//   ".cg-wrap coords.squares.left": {
//     textAlign: "left",
//   },
//   ".cg-wrap coords.squares coord": {
//     padding: "6% 4%",
//   },
//   ".cg-wrap coords.squares.rank2": {
//     transform: "translateX(100%)",
//   },
//   ".cg-wrap coords.squares.rank3": {
//     transform: "translateX(200%)",
//   },
//   ".cg-wrap coords.squares.rank4": {
//     transform: "translateX(300%)",
//   },
//   ".cg-wrap coords.squares.rank5": {
//     transform: "translateX(400%)",
//   },
//   ".cg-wrap coords.squares.rank6": {
//     transform: "translateX(500%)",
//   },
//   ".cg-wrap coords.squares.rank7": {
//     transform: "translateX(600%)",
//   },
//   ".cg-wrap coords.squares.rank8": {
//     transform: "translateX(700%)",
//   },
//   ".cg-board square.move-dest": {
//     background:
//       "radial-gradient(rgba(20, 85, 30, 0.5) 22%, #208530 0, rgba(0, 0, 0, 0.3) 0, rgba(0, 0, 0, 0) 0)",
//   },
//   ".cg-board square.premove-dest": {
//     background:
//       "radial-gradient(rgba(20, 30, 85, 0.5) 22%, #203085 0, rgba(0, 0, 0, 0.3) 0, rgba(0, 0, 0, 0) 0)",
//   },
//   ".cg-board square.oc.move-dest": {
//     background:
//       "radial-gradient(transparent 0%, transparent 80%, rgba(20, 85, 0, 0.3) 80%)",
//   },
//   ".cg-board square.oc.premove-dest": {
//     background:
//       "radial-gradient(transparent 0%, transparent 80%, rgba(20, 30, 85, 0.2) 80%)",
//   },
//   ".cg-board square.move-dest:hover": {
//     background: "rgba(20, 85, 30, 0.3)",
//   },
//   ".cg-board square.premove-dest:hover": {
//     background: "rgba(20, 30, 85, 0.2)",
//   },
//   ".cg-board square.last-move": {
//     backgroundColor: "rgba(155, 199, 0, 0.41)",
//   },
//   ".cg-board square.selected": {
//     backgroundColor: "rgba(20, 85, 30, 0.5)",
//   },
//   ".cg-board square.check": {
//     background:
//       "radial-gradient(ellipse at center, rgba(255, 0, 0, 1) 0%, rgba(231, 0, 0, 1) 25%, rgba(169, 0, 0, 0) 89%, rgba(158, 0, 0, 0) 100%)",
//   },
//   ".cg-board square.current-premove": {
//     backgroundColor: "rgba(20, 30, 85, 0.5)",
//   },
//   ".orientation-white .ranks :nth-child(odd), .orientation-white .files :nth-child(even), .orientation-black .ranks :nth-child(even), .orientation-black .files :nth-child(odd), coords.squares:nth-of-type(odd) :nth-child(even), coords.squares:nth-of-type(even) :nth-child(odd)":
//     {
//       color: "rgba(72, 72, 72, 0.8)",
//     },
//   ".orientation-white .ranks :nth-child(even), .orientation-white .files :nth-child(odd), .orientation-black .ranks :nth-child(odd), .orientation-black .files :nth-child(even), coords.squares:nth-of-type(odd) :nth-child(odd), coords.squares:nth-of-type(even) :nth-child(even)":
//     {
//       color: "rgba(255, 255, 255, 0.8)",
//     },
//   ".cg-wrap piece.pawn.white": {
//     backgroundImage: `url(
//       "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSI+PHBhdGggZD0iTTIyLjUgOWMtMi4yMSAwLTQgMS43OS00IDQgMCAuODkuMjkgMS43MS43OCAyLjM4QzE3LjMzIDE2LjUgMTYgMTguNTkgMTYgMjFjMCAyLjAzLjk0IDMuODQgMi40MSA1LjAzLTMgMS4wNi03LjQxIDUuNTUtNy40MSAxMy40N2gyM2MwLTcuOTItNC40MS0xMi40MS03LjQxLTEzLjQ3IDEuNDctMS4xOSAyLjQxLTMgMi40MS01LjAzIDAtMi40MS0xLjMzLTQuNS0zLjI4LTUuNjIuNDktLjY3Ljc4LTEuNDkuNzgtMi4zOCAwLTIuMjEtMS43OS00LTQtNHoiIGZpbGw9IiNmZmYiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjwvc3ZnPg=="
//     )`,
//   },
//   ".cg-wrap piece.bishop.white": {
//     backgroundImage: `url(
//       "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxnIGZpbGw9IiNmZmYiIHN0cm9rZS1saW5lY2FwPSJidXR0Ij48cGF0aCBkPSJNOSAzNmMzLjM5LS45NyAxMC4xMS40MyAxMy41LTIgMy4zOSAyLjQzIDEwLjExIDEuMDMgMTMuNSAyIDAgMCAxLjY1LjU0IDMgMi0uNjguOTctMS42NS45OS0zIC41LTMuMzktLjk3LTEwLjExLjQ2LTEzLjUtMS0zLjM5IDEuNDYtMTAuMTEuMDMtMTMuNSAxLTEuMzU0LjQ5LTIuMzIzLjQ3LTMtLjUgMS4zNTQtMS45NCAzLTIgMy0yeiIvPjxwYXRoIGQ9Ik0xNSAzMmMyLjUgMi41IDEyLjUgMi41IDE1IDAgLjUtMS41IDAtMiAwLTIgMC0yLjUtMi41LTQtMi41LTQgNS41LTEuNSA2LTExLjUtNS0xNS41LTExIDQtMTAuNSAxNC01IDE1LjUgMCAwLTIuNSAxLjUtMi41IDQgMCAwLS41LjUgMCAyeiIvPjxwYXRoIGQ9Ik0yNSA4YTIuNSAyLjUgMCAxIDEtNSAwIDIuNSAyLjUgMCAxIDEgNSAweiIvPjwvZz48cGF0aCBkPSJNMTcuNSAyNmgxME0xNSAzMGgxNW0tNy41LTE0LjV2NU0yMCAxOGg1IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIi8+PC9nPjwvc3ZnPg=="
//     )`,
//   },
//   ".cg-wrap piece.knight.white": {
//     backgroundImage: `url(
//         "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMiAxMGMxMC41IDEgMTYuNSA4IDE2IDI5SDE1YzAtOSAxMC02LjUgOC0yMSIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0yNCAxOGMuMzggMi45MS01LjU1IDcuMzctOCA5LTMgMi0yLjgyIDQuMzQtNSA0LTEuMDQyLS45NCAxLjQxLTMuMDQgMC0zLTEgMCAuMTkgMS4yMy0xIDItMSAwLTQuMDAzIDEtNC00IDAtMiA2LTEyIDYtMTJzMS44OS0xLjkgMi0zLjVjLS43My0uOTk0LS41LTItLjUtMyAxLTEgMyAyLjUgMyAyLjVoMnMuNzgtMS45OTIgMi41LTNjMSAwIDEgMyAxIDMgIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNOS41IDI1LjVhLjUuNSAwIDEgMS0xIDAgLjUuNSAwIDEgMSAxIDB6bTUuNDMzLTkuNzVhLjUgMS41IDMwIDEgMS0uODY2LS41LjUgMS41IDMwIDEgMSAuODY2LjV6IiBmaWxsPSIjMDAwIi8+PC9nPjwvc3ZnPg=="
//     )`,
//   },
//   ".cg-wrap piece.rook.white": {
//     backgroundImage: `url(
//         "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSI+PGcgZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik05IDM5aDI3di0zSDl2M3ptMy0zdi00aDIxdjRIMTJ6bS0xLTIyVjloNHYyaDVWOWg1djJoNVY5aDR2NSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMzQgMTRsLTMgM0gxNGwtMy0zIi8+PHBhdGggZD0iTTMxIDE3djEyLjVIMTRWMTciIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIi8+PHBhdGggZD0iTTMxIDI5LjVsMS41IDIuNWgtMjBsMS41LTIuNSIvPjxwYXRoIGQ9Ik0xMSAxNGgyMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIvPjwvZz48L3N2Zz4='
//         )`,
//   },
//   ".cg-wrap piece.queen.white": {
//     backgroundImage: `url(
//             "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSI+PGcgZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik04IDEyYTIyIDIyIDAgMSAxLTQgMCAyIDIyIDAgMSAxIDQgMHptMTYuNS00LjVhMiAyIDAgMSAxLTQgMCAyIDIgMCAxIDEgNCAwei00MSAxMmEyIDIgMCAxIDEtNCAwIDIgMiAwIDEgMSA0IDB6TTE2IDguNWEyIDIgMCAxIDEtNCAwIDIgMiAwIDEgMSA0IDB6TTMzIDlhMiAyIDAgMSAxLTQgMCAyIDIyIDAgMSAxIDQgMHoiLz48cGF0aCBkPSJNOTIyNiAyNjY4YzguNS0xLjUgMjEtMS41IDI3IDBsMi0xMi03IDExVjExbC01LjUgMTMuNS0zLTE1LTMgMTUtNS41LTE0LTE1LjUtMTF6IiBmaWxsPSIjMDAwIi8+PC9nPjwvc3ZnPg=="
//         )`,
//   },
//   ".cg-wrap piece.king.white": {
//     backgroundImage: `url(
//             "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSI+PGcgZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik04IDEyYTIyIDIyIDAgMSAxLTQgMCAyIDIyIDAgMSAxIDQgMHptMTYuNS00LjVhMiAyIDAgMSAxLTQgMCAyIDIgMCAxIDEgNCAwei00MSAxMmEyIDIgMCAxIDEtNCAwIDIgMiAwIDEgMSA0IDB6TTE2IDguNWEyIDIgMCAxIDEtNCAwIDIgMiAwIDEgMSA0IDB6TTMzIDlhMiAyIDAgMSAxLTQgMCAyIDIyIDAgMSAxIDQgMHoiLz48cGF0aCBkPSJNOTIyNiAyNjY4YzguNS0xLjUgMjEtMS41IDI3IDBsMi0xMi03IDExVjExbC01LjUgMTMuNS0zLTE1LTMgMTUtNS41LTE0LTE1LjUtMTF6IiBmaWxsPSIjMDAwIi8+PC9nPjwvc3ZnPg=="
//         )`,
//   },
//   ".cg-wrap piece.pawn.black": {
//     backgroundImage: `url(
//       "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSI+PHBhdGggZD0iTTIyLjUgMzljLTIuMjEgMC00IDEuNzktNC00IDAtLjg5LTIuNzEtMS43MS03LjM4QzE3LjMzIDI1LjUgMTYgMjcuNTkgMTYgMzFjMCAyLjAzLjk0IDMuODQgMi40MSA1LjAzIDMgMS4wNiA3LjQxLTUuNTUgNy40MS0xMy40N2gyM2MwIDcuOTIgNC40MSAxMi40MSA3LjQxIDEzLjQ3LTEuNDcgMS4xOS0yLjQxIDMtMi40MSA1LjAzIDAgMi40MSAxLjMzIDQuNSAzLjI4IDUuNjItNC45LjY3Ljc4IDEuNDkuNzggMi4zOCAwIDIuMjEgMS43OSA0IDQgNHoiIGZpbGw9IiNmZmYiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjwvc3ZnPg=="
//     )`,
//   },
//   ".cg-wrap piece.bishop.black": {
//     backgroundImage: `url(
//       "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxnIGZpbGw9IiNmZmYiIHN0cm9rZS1saW5lY2FwPSJidXR0Ij48cGF0aCBkPSJNOSAzNmMzLjM5LS45NyAxMC4xMS40MyAxMy41LTIgMy4zOSAyLjQzIDEwLjExIDEuMDMgMTMuNSAyIDAgMCAxLjY1LjU0IDMgMi0uNjguOTctMS42NS45OS0zIC41LTMuMzktLjk3LTEwLjExLjQ2LTEzLjUtMS0zLjM5IDEuNDYtMTAuMTEuMDMtMTMuNSAxLTEuMzU0LjQ5LTIuMzIzLjQ3LTMtLjUgMS4zNTQtMS45NCAzLTIgMy0yeiIvPjxwYXRoIGQ9Ik0xNSAzMmMyLjUgMi41IDEyLjUgMi41IDE1IDAgLjUtMS41IDAtMiAwLTIgMC0yLjUtMi41LTQtMi41LTQgNS41LTEuNSA2LTExLjUtNS0xNS41LTExIDQtMTAuNSAxNC01IDE1LjUgMCAwLTIuNSAxLjUtMi41IDQgMCAwLS41LjUgMCAyeiIvPjxwYXRoIGQ9Ik0yNSA4YTIuNSAyLjUgMCAxIDEtNSAwIDIuNSAyLjUgMCAxIDEgNSAweiIvPjwvZz48cGF0aCBkPSJNMTcuNSAyNmgxME0xNSAzMGgxNW0tNy41LTE0LjV2NU0yMCAxOGg1IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIi8+PC9nPjwvc3ZnPg=="
//     )`,
//   },
//   ".cg-wrap piece.knight.black": {
//     backgroundImage: `url(
//       "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMiAxMGMxMC41IDEgMTYuNSA4IDE2IDI5SDE1YzAtOSAxMC02LjUgOC0yMSIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0yNCAxOGMuMzggMi45MS01LjU1IDcuMzctOCA5LTMgMi0yLjgyIDQuMzQtNSA0LTEuMDQyLS45NCAxLjQxLTMuMDQgMC0zLTEgMCAuMTkgMS4yMy0xIDItMSAwLTQuMDAzIDEtNC00IDAtMiA2LTEyIDYtMTJzMS44OS0xLjkgMi0zLjVjLS43My0uOTk0LS41LTItLjUtMyAxLTEgMyAyLjUgMyAyLjVoMnMuNzgtMS45OTIgMi41LTNjMSAwIDEgMyAxIDMgIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNOS41IDI1LjVhLjUuNSAwIDEgMS0xIDAgLjUuNSAwIDEgMSAxIDB6bTUuNDMzLTkuNzVhLjUgMS41IDMwIDEgMS0uODY2LS41LjUgMS41IDMwIDEgMSAuODY2LjV6IiBmaWxsPSIjMDAwIi8+PC9nPjwvc3ZnPg=="
//     )`,
//   },
//   ".cg-wrap piece.rook.black": {
//     backgroundImage: `url(
//       "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSI+PGcgZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik05IDM5aDI3di0zSDl2M3ptMy0zdi00aDIxdjRIMTJ6bS0xLTIyVjloNHYyaDVWOWg1djJoNVY5aDR2NSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMzQgMTRsLTMgM0gxNGwtMy0zIi8+PHBhdGggZD0iTTMxIDE3djEyLjVIMTRWMTciIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIi8+PHBhdGggZD0iTTMxIDI5LjVsMS41IDIuNWgtMjBsMS41LTIuNSIvPjxwYXRoIGQ9Ik0xMSAxNGgyMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIvPjwvZz48L3N2Zz4='
//     )`,
//   },
//   ".cg-wrap piece.queen.black": {
//     backgroundImage: `url(
//       "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSI+PGcgZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik04IDEyYTIyIDIyIDAgMSAxLTQgMCAyIDIyIDAgMSAxIDQgMHptMTYuNS00LjVhMiAyIDAgMSAxLTQgMCAyIDIgMCAxIDEgNCAwei00MSAxMmEyIDIgMCAxIDEtNCAwIDIgMiAwIDEgMSA0IDB6TTE2IDguNWEyIDIgMCAxIDEtNCAwIDIgMiAwIDEgMSA0IDB6TTMzIDlhMiAyIDAgMSAxLTQgMCAyIDIyIDAgMSAxIDQgMHoiLz48cGF0aCBkPSJNOTIyNiAyNjY4YzguNS0xLjUgMjEtMS41IDI3IDBsMi0xMi03IDExVjExbC01LjUgMTMuNS0zLTE1LTMgMTUtNS41LTE0LTE1LjUtMTF6IiBmaWxsPSIjMDAwIi8+PC9nPjwvc3ZnPg=="
//     )`,
//   },
//   ".cg-wrap piece.king.black": {
//     backgroundImage: `url(
//       "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSI+PGcgZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik04IDEyYTIyIDIyIDAgMSAxLTQgMCAyIDIyIDAgMSAxIDQgMHptMTYuNS00LjVhMiAyIDAgMSAxLTQgMCAyIDIgMCAxIDEgNCAwei00MSAxMmEyIDIgMCAxIDEtNCAwIDIgMiAwIDEgMSA0IDB6TTE2IDguNWEyIDIgMCAxIDEtNCAwIDIgMiAwIDEgMSA0IDB6TTMzIDlhMiAyIDAgMSAxLTQgMCAyIDIyIDAgMSAxIDQgMHoiLz48cGF0aCBkPSJNOTIyNiAyNjY4YzguNS0xLjUgMjEtMS41IDI3IDBsMi0xMi03IDExVjExbC01LjUgMTMuNS0zLTE1LTMgMTUtNS41LTE0LTE1LjUtMTF6IiBmaWxsPSIjMDAwIi8+PC9nPjwvc3ZnPg=="
//     )`,
//   },
// });
