const boardFlipped = false;
const currentMoveIndex = 0;
const reportResults: any = undefined;

export async function drawBoard(
  ctx: CanvasRenderingContext2D,
  fen = startingPositionFen
) {
  // Draw surface of board
  let colours = ["#f6dfc0", "#b88767"];

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      ctx.fillStyle = colours[(x + y) % 2];

      ctx.fillRect(x * 90, y * 90, 90, 90);
    }
  }

  // Draw coordinates
  ctx.font = "20px Arial";

  let files = "abcdefgh".split("");
  for (let x = 0; x < 8; x++) {
    ctx.fillStyle = colours[x % 2];
    ctx.fillText(boardFlipped ? files[7 - x] : files[x], x * 90 + 5, 715);
  }
  for (let y = 0; y < 8; y++) {
    ctx.fillStyle = colours[(y + 1) % 2];
    ctx.fillText(
      boardFlipped ? (y + 1).toString() : (8 - y).toString(),
      5,
      y * 90 + 22
    );
  }

  // Draw last move highlight and top move arrows
  let lastMove = reportResults?.positions[currentMoveIndex];

  let lastMoveCoordinates = {
    from: { x: 0, y: 0 },
    to: { x: 0, y: 0 },
  };

  if (currentMoveIndex > 0 && lastMove) {
    let lastMoveUCI = lastMove.move?.uci;
    if (!lastMoveUCI) return;

    lastMoveCoordinates.from = getBoardCoordinates(lastMoveUCI.slice(0, 2));
    lastMoveCoordinates.to = getBoardCoordinates(lastMoveUCI.slice(2, 4));

    ctx.globalAlpha = 0.7;
    ctx.fillStyle =
      classificationColours[
        reportResults?.positions[currentMoveIndex].classification ?? "book"
      ];
    ctx.fillRect(
      lastMoveCoordinates.from.x * 90,
      lastMoveCoordinates.from.y * 90,
      90,
      90
    );
    ctx.fillRect(
      lastMoveCoordinates.to.x * 90,
      lastMoveCoordinates.to.y * 90,
      90,
      90
    );
    ctx.globalAlpha = 1;
  }

  // Draw pieces
  let fenBoard = fen.split(" ")[0];
  let x = boardFlipped ? 7 : 0,
    y = x;

  for (let character of fenBoard) {
    if (character == "/") {
      x = boardFlipped ? 7 : 0;
      y += boardFlipped ? -1 : 1;
    } else if (/\d/g.test(character)) {
      x += parseInt(character) * (boardFlipped ? -1 : 1);
    } else {
      const pieceSrc = pieceImagesSrc[character];
      if (!pieceSrc) throw new Error(`No image source for piece ${character}`);
      const pieceImage = await loadImage(pieceSrc);

      ctx.drawImage(pieceImage, x * 90, y * 90, 90, 90);
      x += boardFlipped ? -1 : 1;
    }
  }

  // Draw last move classification
  if (currentMoveIndex > 0 && reportResults) {
    let classification =
      reportResults?.positions[currentMoveIndex]?.classification;

    if (!classification) return;

    const iconSrc = classificationIconsSrc[classification];
    if (!iconSrc)
      throw new Error(`No image source for classification ${classification}`);
    const classificationIcon = await loadImage(iconSrc);

    ctx.drawImage(
      classificationIcon,
      lastMoveCoordinates.to.x * 90 + 68,
      lastMoveCoordinates.to.y * 90 - 10,
      32,
      32
    );
  }

  // Draw engine suggestion arrows
  if (true) {
    let arrowAttributes = [
      {
        width: 20,
        opacity: 0.8,
      },
      {
        width: 12,
        opacity: 0.55,
      },
    ];

    let topLineIndex = -1;
    for (let topLine of lastMove?.topLines ?? []) {
      topLineIndex++;

      let from = getBoardCoordinates(topLine.moveUCI.slice(0, 2));
      let to = getBoardCoordinates(topLine.moveUCI.slice(2, 4));

      let arrow = drawArrow(
        from.x * 90 + 45,
        from.y * 90 + 45,
        to.x * 90 + 45,
        to.y * 90 + 45,
        arrowAttributes[topLineIndex].width,
        ctx
      );
      if (!arrow) continue;

      ctx.globalAlpha = arrowAttributes[topLineIndex].opacity;
      ctx.drawImage(arrow, 0, 0);
      ctx.globalAlpha = 1;
    }
  }
}

function getBoardCoordinates(square: string): { x: number; y: number } {
  if (boardFlipped) {
    return {
      x: 7 - "abcdefgh".split("").indexOf(square.slice(0, 1)),
      y: parseInt(square.slice(1)) - 1,
    };
  } else {
    return {
      x: "abcdefgh".split("").indexOf(square.slice(0, 1)),
      y: 8 - parseInt(square.slice(1)),
    };
  }
}

function drawArrow(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  width: number,
  arrowCtx: CanvasRenderingContext2D
) {
  if (!arrowCtx) return;

  arrowCtx.canvas.width = 720;
  arrowCtx.canvas.height = 720;

  let headlen = 15;
  let angle = Math.atan2(toY - fromY, toX - fromX);
  toX -= Math.cos(angle) * (width * 1.15);
  toY -= Math.sin(angle) * (width * 1.15);

  arrowCtx.beginPath();
  arrowCtx.moveTo(fromX, fromY);
  arrowCtx.lineTo(toX, toY);
  arrowCtx.strokeStyle = classificationColours.best;
  arrowCtx.lineWidth = width;
  arrowCtx.stroke();

  arrowCtx.beginPath();
  arrowCtx.moveTo(toX, toY);
  arrowCtx.lineTo(
    toX - headlen * Math.cos(angle - Math.PI / 7),
    toY - headlen * Math.sin(angle - Math.PI / 7)
  );

  arrowCtx.lineTo(
    toX - headlen * Math.cos(angle + Math.PI / 7),
    toY - headlen * Math.sin(angle + Math.PI / 7)
  );

  arrowCtx.lineTo(toX, toY);
  arrowCtx.lineTo(
    toX - headlen * Math.cos(angle - Math.PI / 7),
    toY - headlen * Math.sin(angle - Math.PI / 7)
  );

  arrowCtx.strokeStyle = classificationColours.best;
  arrowCtx.lineWidth = width;
  arrowCtx.stroke();
  arrowCtx.fillStyle = classificationColours.best;
  arrowCtx.fill();

  return arrowCtx.canvas;
}

const startingPositionFen =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const classificationColours: { [key: string]: string } = {
  brilliant: "#1baaa6",
  great: "#5b8baf",
  best: "#98bc49",
  excellent: "#98bc49",
  good: "#97af8b",
  inaccuracy: "#f4bf44",
  mistake: "#e28c28",
  blunder: "#c93230",
  forced: "#97af8b",
  book: "#a88764",
};

const pieceImagesSrc: Record<string, string | undefined> = {
  P: "white_pawn.svg",
  N: "white_knight.svg",
  B: "white_bishop.svg",
  R: "white_rook.svg",
  Q: "white_queen.svg",
  K: "white_king.svg",
  p: "black_pawn.svg",
  n: "black_knight.svg",
  b: "black_bishop.svg",
  r: "black_rook.svg",
  q: "black_queen.svg",
  k: "black_king.svg",
};

const classificationIconsSrc: Record<string, string | undefined> = {
  brilliant: "brilliant.png",
  great: "great.png",
  best: "best.png",
  excellent: "excellent.png",
  good: "good.png",
  inaccuracy: "inaccuracy.png",
  mistake: "mistake.png",
  blunder: "blunder.png",
  forced: "forced.png",
  book: "book.png",
};

async function loadImage(filename: string): Promise<HTMLImageElement> {
  return new Promise((res) => {
    const image = new Image();
    image.src = filename;

    image.addEventListener("load", () => res(image));
  });
}
