import { GameOrigin } from "@/types/enums";
import { useAtom } from "jotai";
import { gamePgnAtom } from "../index.state";

interface Props {
  gameOrigin: GameOrigin;
  placeholder?: string;
}

export default function InputGame({ placeholder }: Props) {
  const [gamePgn, setGamePgn] = useAtom(gamePgnAtom);

  return (
    <textarea
      id="pgn"
      className="white"
      cols={30}
      rows={10}
      spellCheck="false"
      placeholder={placeholder}
      value={gamePgn}
      onChange={(e) => {
        setGamePgn(e.target.value);
      }}
    />
  );
}
