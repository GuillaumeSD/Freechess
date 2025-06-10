import { Icon } from "@iconify/react";
import { Chip, Tooltip } from "@mui/material";

interface Props {
  date?: string;
}

export default function DateChip({ date }: Props) {
  if (!date) return null;

  return (
    <Tooltip title="Date Played">
      <Chip
        icon={<Icon icon="material-symbols:calendar-today" />}
        label={date}
        size="small"
      />
    </Tooltip>
  );
}
