import { FormControl, TextField, Button } from "@mui/material";
import { Icon } from "@iconify/react";
import React from "react";

interface Props {
  pgn: string;
  setPgn: (pgn: string) => void;
}

export default function GamePgnInput({ pgn, setPgn }: Props) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const fileContent = e.target?.result as string;
        setPgn(fileContent);
      };

      reader.readAsText(file); // Read the file as text
    }
  };

  return (
    <FormControl fullWidth>
      <TextField
        label="Enter PGN here..."
        variant="outlined"
        multiline
        value={pgn}
        onChange={(e) => setPgn(e.target.value)}
        rows={8}
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        component="label"
        startIcon={<Icon icon="material-symbols:upload" />}
      >
        Choose PGN File
        <input
          type="file"
          hidden // Hide the default file input
          accept=".pgn" // Only allow .pgn files
          onChange={handleFileChange}
        />
      </Button>
    </FormControl>
  );
}
