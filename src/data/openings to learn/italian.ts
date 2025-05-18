// italianGame.ts

export type Move = string;

export interface Variation {
  name: string;
  moves: Move[];
}

export const italianGameVariations: Variation[] = [
  {
    name: "Italian Game Line 1",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5", "c3", "h6", "d4", "exd4", "cxd4", "Bb4+", "Nc3", "Nf6", "e5", "Ne4", "O-O", "Nxc3", "bxc3", "Bxc3", "Qb3", "Bxa1", "Bxf7+", "Kf8", "Ba3+", "d6", "exd6", "cxd6", "Bg6", "Qf6", "Bxd6+", "Ne7", "Re1"],
  },
  {
    name: "Italian Game Line 2",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Nf6", "d4", "Nxe4", "dxe5", "Bc5", "Qd5", "Bxf2+", "Kf1", "O-O", "Qxe4"],
  },
  {
    name: "Italian Game Line 3",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5", "c3", "Nf6", "d4", "exd4", "cxd4", "Bb6", "e5", "Ng4", "h3", "Nh6", "d5", "Na5", "Bg5", "f6", "exf6"],
  },
  {
    name: "Italian Game Line 4",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Nf6", "d4", "exd4", "O-O", "Nxe4", "Re1", "d5", "Bxd5", "Qxd5", "Nc3", "Qa5", "Nxe4", "Be6", "Neg5", "O-O-O", "Nxe6", "fxe6", "Rxe6", "Bd6", "Bg5", "Rde8", "Qe2"],
  },
  {
    name: "Italian Game Line 5",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Nf6", "d4", "exd4", "O-O", "Nxe4", "Re1", "d5", "Bxd5", "Qxd5", "Nc3", "Qh5", "Nxe4", "Be6", "Bg5", "Bd6", "Nxd6+", "cxd6", "Bf4", "Qd5", "c3"],
  },
  {
    name: "Italian Game Line 6",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5", "c3", "Nf6", "d4", "exd4", "cxd4", "Bb4+", "Nc3", "Nxe4", "O-O", "Bxc3", "d5", "Ne5", "bxc3", "Nxc4", "Qd4", "O-O", "Qxc4", "Nd6", "Qb3"],
  },
  {
    name: "Italian Game Line 7",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5", "c3", "Nf6", "d4", "exd4", "cxd4", "Bb4+", "Nc3", "Nxe4", "O-O", "Nxc3", "bxc3", "Bxc3", "Ba3", "d6", "Rc1", "Ba5", "Qa4", "O-O", "d5", "Ne5", "Nxe5", "dxe5", "Qxa5"],
  },
  {
    name: "Italian Game Line 8",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5", "c3", "Nf6", "d4", "exd4", "cxd4", "Bb4+", "Nc3", "Nxe4", "O-O", "Nxc3", "bxc3", "Bxc3", "Ba3", "d6", "Rc1", "Bb4", "Bxb4", "Nxb4", "Qe1+", "Qe7", "Qxb4"],
  },
  {
    name: "Italian Game Line 9",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5", "c3", "Nf6", "d4", "exd4", "cxd4", "Bb4+", "Nc3", "Nxe4", "O-O", "Bxc3", "d5", "Bf6", "Re1", "Ne7", "Rxe4", "d6", "Bg5", "Bxg5", "Nxg5", "O-O", "Nxh7", "Kxh7", "Qh5+", "Kg8", "Rh4"],
  },
  {
    name: "Italian Game Line 10",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5", "c3", "Nf6", "d4", "exd4", "cxd4", "Bb4+", "Nc3", "Nxe4", "O-O", "Bxc3", "d5", "Bf6", "Re1", "Ne7", "Rxe4", "d6", "Bg5", "Bxg5", "Nxg5", "h6", "Bb5+", "c6", "Nxf7", "Kxf7", "Qf3+", "Kg8", "Rae1", "cxb5", "Rxe7"],
  },
  {
    name: "Italian Game Line 11",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5", "c3", "Nf6", "d4", "exd4", "cxd4", "Bb4+", "Nc3", "Nxe4", "O-O", "Bxc3", "d5", "Ne5", "bxc3", "Nxc4", "Qd4", "Ncd6", "Qxg7", "Qf6", "Qxf6", "Nxf6", "Re1+", "Kf8", "Bh6+", "Kg8", "Re5", "Nde4", "Nd2", "d6", "Nxe4", "Nxe4", "Re8#"],
  },
  {
    name: "Italian Game Line 12",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5", "c3", "Nf6", "d4", "exd4", "cxd4", "Bb4+", "Nc3", "Nxe4", "O-O", "Bxc3", "d5", "Ne5", "bxc3", "Nxc4", "Qd4", "Ncd6", "Qxg7", "Qf6", "Qxf6", "Nxf6", "Re1+", "Kf8", "Bh6+", "Kg8", "Re5", "Nfe4", "Re1", "f6", "Re7", "Nf5", "Re8+", "Kf7", "Rxh8", "Nxh6", "Rxe4"],
  },
  {
    name: "Italian Game Line 13",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Nf6", "d4", "d6", "d5"],
  },
  {
    name: "Italian Game Line 14",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5", "c3", "h6", "d4", "exd4", "cxd4", "Bb4+", "Nc3", "d6", "O-O"],
  },
  {
    name: "Italian Game Line 15",
    moves: ["e4", "e5", "Nf3", "d6", "d4", "exd4", "Nxd4", "Nf6", "Nc3", "Be7", "Bf4", "O-O", "Qd2", "a6", "O-O-O"],
  },
  {
    name: "Italian Game Line 16",
    moves: ["e4", "e5", "Nf3", "d6", "d4", "exd4", "Nxd4", "Be7", "Nc3", "Nf6", "Bf4", "O-O", "Qd2", "a6", "O-O-O"],
  },
  {
    name: "Italian Game Line 17",
    moves: ["e4", "e5", "Nf3", "d6", "d4", "Nc6", "Bb5", "exd4", "Qxd4", "Bd7", "Bxc6", "Bxc6", "Nc3", "Nf6", "Bg5", "Be7", "O-O-O"],
  },
  {
    name: "Italian Game Line 18",
    moves: ["e4", "e5", "Nf3", "d6", "d4", "Nc6", "Bb5", "Bd7", "Nc3", "exd4", "Nxd4", "Nxd4", "Bxd7+", "Qxd7", "Qxd4", "Nf6", "Bg5", "Be7", "O-O-O"],
  },
  {
    name: "Italian Game Line 19",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Nf6", "d4", "exd4", "O-O", "Nxe4", "Re1", "d5", "Bxd5", "Qxd5", "Nc3", "Qd8", "Rxe4+", "Be7", "Nxd4", "O-O", "Nxc6", "bxc6", "Qxd8", "Bxd8", "Rc4"],
  },
  {
    name: "Italian Game Line 20",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Nf6", "d4", "exd4", "O-O", "Nxe4", "Re1", "d5", "Bxd5", "Qxd5", "Nc3", "Qd8", "Rxe4+", "Be7", "Nxd4", "O-O", "Nxc6", "Qxd1+", "Nxd1", "bxc6", "Rxe7"],
  },
  {
    name: "Italian Game Line 21",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5", "c3", "Nf6", "d4", "exd4", "cxd4", "Bb4+", "Nc3", "Nxe4", "O-O", "Bxc3", "d5", "Bf6", "Re1", "Ne7", "Rxe4", "d6", "Bg5", "Bxg5", "Nxg5", "h6", "Bb5+", "Bd7", "Qe2", "hxg5", "Re1", "O-O", "Rxe7", "Bxb5", "Qxb5"],
  },
  {
    name: "Italian Game Line 22",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5", "c3", "Nf6", "d4", "exd4", "cxd4", "Bb4+", "Nc3", "Nxe4", "O-O", "Bxc3", "d5", "Bf6", "Re1", "Ne7", "Rxe4", "d6", "Bg5", "Bxg5", "Nxg5", "h6", "Bb5+", "Kf8", "Qh5", "g6", "Qf3", "hxg5", "Qf6", "Rh4", "Rxh4", "gxh4", "Re1", "Bd7", "Rxe7", "Qxe7", "Qh8#"],
  },
];