import { TextField } from "@mui/material";
import { useAtom } from "jotai";
import { gameInputPgnAtom } from "./gameInput.states";

export default function InputGame() {
  const [pgn, setPgn] = useAtom(gameInputPgnAtom);

  return (
    <TextField
      fullWidth
      label="Enter PGN here..."
      sx={{ marginX: 4 }}
      value={pgn}
      onChange={(e) => {
        setPgn(e.target.value);
      }}
    />
  );
}
