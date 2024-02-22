import { Grid, Typography } from "@mui/material";
import { Icon } from "@iconify/react";
import {
  DataGrid,
  GridColDef,
  GridLocaleText,
  GRID_DEFAULT_LOCALE_TEXT,
  GridActionsCellItem,
  GridRowId,
} from "@mui/x-data-grid";
import { useCallback, useMemo } from "react";
import { red } from "@mui/material/colors";
import LoadGameButton from "@/sections/loadGame/loadGameButton";
import { useGameDatabase } from "@/hooks/useGameDatabase";

const gridLocaleText: GridLocaleText = {
  ...GRID_DEFAULT_LOCALE_TEXT,
  noRowsLabel: "No games found",
};

export default function GameDatabase() {
  const { games, deleteGame } = useGameDatabase(true);

  const handleDeleteGameRow = useCallback(
    (id: GridRowId) => async () => {
      if (typeof id !== "number") {
        throw new Error("Unable to remove game");
      }
      await deleteGame(id);
    },
    [deleteGame]
  );

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "event",
        headerName: "Event",
        width: 150,
      },
      {
        field: "site",
        headerName: "Site",
        width: 150,
      },
      {
        field: "date",
        headerName: "Date",
        width: 150,
      },
      {
        field: "round",
        headerName: "Round",
        headerAlign: "center",
        align: "center",
        width: 150,
      },
      {
        field: "white",
        headerName: "White",
        width: 150,
        headerAlign: "center",
        align: "center",
      },
      {
        field: "result",
        headerName: "Result",
        headerAlign: "center",
        align: "center",
        width: 100,
      },
      {
        field: "black",
        headerName: "Black",
        width: 150,
        headerAlign: "center",
        align: "center",
      },
      {
        field: "actions",
        type: "actions",
        headerName: "Delete",
        width: 100,
        cellClassName: "actions",
        getActions: ({ id }) => {
          return [
            <GridActionsCellItem
              icon={
                <Icon icon="mdi:delete-outline" color={red[400]} width="20px" />
              }
              label="Supprimer"
              onClick={handleDeleteGameRow(id)}
              color="inherit"
              key={`${id}-delete-button`}
            />,
          ];
        },
      },
    ],
    [handleDeleteGameRow]
  );

  return (
    <Grid container rowSpacing={3} justifyContent="center" alignItems="center">
      <Grid
        item
        container
        xs={12}
        justifyContent="center"
        alignItems="center"
        spacing={4}
      >
        <Grid item container justifyContent="center" sx={{ maxWidth: "250px" }}>
          <LoadGameButton />
        </Grid>
      </Grid>

      <Grid item container xs={12} justifyContent="center" alignItems="center">
        <Typography variant="subtitle2">
          You have {0} games in your database
        </Typography>
      </Grid>

      <Grid item maxWidth="100%" minWidth="50px">
        <DataGrid
          aria-label="Games list"
          rows={games}
          columns={columns}
          disableColumnMenu
          hideFooter={true}
          autoHeight={true}
          localeText={gridLocaleText}
        />
      </Grid>
    </Grid>
  );
}
