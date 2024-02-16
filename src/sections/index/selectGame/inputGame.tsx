import { GameOrigin } from "@/types/enums";
import { useSetAtom } from "jotai";
import { gameFensAtom } from "./gameOrigin.state";
import { useEffect, useState } from "react";
import { Chess } from "chess.js";

interface Props {
  gameOrigin: GameOrigin;
  placeholder?: string;
}

export default function InputGame({ placeholder }: Props) {
  const [gamePgn, setGamePgn] = useState("");
  const setGameFens = useSetAtom(gameFensAtom);

  useEffect(() => {
    const chess = new Chess();
    chess.loadPgn(gamePgn);
    const fens = chess.history({ verbose: true }).map((move) => {
      return move.after;
    });
    setGameFens(fens);
  }, [gamePgn]);

  return (
    <textarea
      id="pgn"
      className="white"
      cols={30}
      rows={10}
      spellCheck="false"
      placeholder={placeholder}
      value={gamePgn}
      onChange={(e) => setGamePgn(e.target.value)}
    />
  );
}
