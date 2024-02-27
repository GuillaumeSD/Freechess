import { FormControl, TextField } from "@mui/material";

interface Props {
  pgn: string;
  setPgn: (pgn: string) => void;
}

export default function GamePgnInput({ pgn, setPgn }: Props) {
  return (
    <FormControl sx={{ m: 1, width: 600 }}>
      <TextField
        label="Enter PGN here..."
        variant="outlined"
        multiline
        value={pgn}
        onChange={(e) => setPgn(e.target.value)}
      />
    </FormControl>
  );
}
