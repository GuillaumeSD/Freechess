export enum GameOrigin {
  Pgn = "pgn",
  ChessCom = "chesscom",
  Lichess = "lichess",
}

export enum EngineName {
  Stockfish16 = "stockfish_16",
  Stockfish16NNUE = "stockfish_16_nnue",
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
