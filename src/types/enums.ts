export enum GameOrigin {
  Pgn = "pgn",
  ChessCom = "chesscom",
  Lichess = "lichess",
}

export enum EngineName {
  Stockfish17 = "stockfish_17",
  Stockfish17Lite = "stockfish_17_lite",
  Stockfish16_1 = "stockfish_16_1",
  Stockfish16_1Lite = "stockfish_16_1_lite",
  Stockfish16NNUE = "stockfish_16_nnue",
  Stockfish16 = "stockfish_16",
  Stockfish11 = "stockfish_11",
}

export enum MoveClassification {
  Blunder = "blunder",
  Mistake = "mistake",
  Inaccuracy = "inaccuracy",
  Good = "good",
  Excellent = "excellent",
  Best = "best",
  Book = "book",
  Great = "great",
  Brilliant = "brilliant",
}

export enum Color {
  White = "w",
  Black = "b",
}
