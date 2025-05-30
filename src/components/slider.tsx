import { Icon } from "@iconify/react";
import {
  ClickAwayListener,
  Grid2 as Grid,
  IconButton,
  Slider as MuiSlider,
  Popover,
  Stack,
  styled,
  Typography,
  TypographyProps,
} from "@mui/material";
import { MouseEvent, useState } from "react";

export interface Props {
  value: number;
  setValue: (value: number) => void;
  min: number;
  max: number;
  label: string;
  size?: number;
  marksFilter?: number;
  step?: number;
  infoContent?: TypographyProps["children"];
}

export default function Slider({
  min,
  max,
  label,
  value,
  setValue,
  size,
  marksFilter,
  step = 1,
  infoContent,
}: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenPopover = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      size={size ?? 11}
    >
      <Stack direction="row" width="100%">
        <Typography id={`input-${label}`} variant="body2">
          {step === 1 && marksFilter ? label : `${label}: ${value}`}
        </Typography>

        {!!infoContent && (
          <>
            <ClickAwayListener onClickAway={handleClosePopover}>
              <IconButton
                size="medium"
                aria-owns={anchorEl ? "mouse-over-popover" : undefined}
                aria-haspopup="true"
                onClick={handleOpenPopover}
                onMouseEnter={handleOpenPopover}
                onMouseLeave={handleClosePopover}
                sx={{ ml: 1, padding: 0 }}
                aria-label="Help about number of threads"
              >
                <Icon icon="mdi:info-outline" width="1.1rem" />
              </IconButton>
            </ClickAwayListener>

            <Popover
              id="mouse-over-popover"
              open={!!anchorEl}
              anchorEl={anchorEl}
              onClose={handleClosePopover}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              transformOrigin={{ vertical: "top", horizontal: "center" }}
              sx={{ pointerEvents: "none" }}
              disableRestoreFocus
            >
              <Typography variant="body2" sx={{ padding: 2, maxWidth: 500 }}>
                {infoContent}
              </Typography>
            </Popover>
          </>
        )}
      </Stack>

      <CustomSlider
        min={min}
        max={max}
        marks={
          marksFilter
            ? Array.from({ length: max - min + 1 }, (_, i) => ({
                value: i + min,
                label: `${i + min}`,
              })).filter((_, i) => i % marksFilter === 0)
            : undefined
        }
        step={step}
        valueLabelDisplay="off"
        value={value}
        onChange={(_, value) => setValue(value as number)}
        aria-labelledby={`input-${label}`}
      />
    </Grid>
  );
}

const CustomSlider = styled(MuiSlider)(() => ({
  ".MuiSlider-markLabel": {
    fontSize: "0.8rem",
    lineHeight: "0.8rem",
  },
  ".MuiSlider-thumb": {
    width: "18px",
    height: "18px",
  },
  marginBottom: "1rem",
}));
