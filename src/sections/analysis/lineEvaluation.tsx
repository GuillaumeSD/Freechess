import { LineEval } from "@/types/eval";
import { ListItem, ListItemText, Typography } from "@mui/material";

interface Props {
  line: LineEval;
}

export default function LineEvaluation({ line }: Props) {
  const lineLabel =
    line.cp !== undefined
      ? `${line.cp / 100}`
      : line.mate
      ? `Mate in ${Math.abs(line.mate)}`
      : "?";

  return (
    <ListItem disablePadding>
      <ListItemText primary={lineLabel} sx={{ marginRight: 2 }} />
      <Typography>{line.pv.slice(0, 7).join(", ")}</Typography>
    </ListItem>
  );
}
