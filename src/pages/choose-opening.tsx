import React from "react";
import { useRouter } from "next/router";
import { PageTitle } from "@/components/pageTitle";
import { Box, Typography, Paper, Stack } from "@mui/material";

// List of available openings (evolutive)
interface Opening {
  key: string;
  name: string;
  description?: string;
  available: boolean;
}

const openings: Opening[] = [
  {
    key: "italian",
    name: "Italian Game",
    description:
      "A classic and popular opening for beginners and intermediate players.",
    available: true,
  },
  {
    key: "caro-kann",
    name: "Caro-Kann",
    description: "Coming soon ! A solid defense for strategic players.",
    available: false,
  },
  {
    key: "england-gambit",
    name: "England Gambit",
    description:
      "Coming soon ! An aggressive gambit to surprise your opponent.",
    available: false,
  },
];

export default function ChooseOpeningPage() {
  const router = useRouter();

  const handleChoose = (openingKey: string) => {
    router.push(`/opening-trainer?opening=${openingKey}`);
  };

  return (
    <>
      <PageTitle title="Choose an opening | Chesskit" />
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          width: "100%",
          maxWidth: 600,
          mx: "auto",
          mt: { xs: 2, md: 6 },
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 4,
            textAlign: "center",
            letterSpacing: 0.5,
            color: "primary.main",
          }}
        >
          Choose an opening
        </Typography>
        <Stack spacing={3} width="100%">
          {openings.map((opening) => (
            <Paper
              key={opening.key}
              elevation={3}
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                background: (theme) =>
                  theme.palette.mode === "dark" ? "#232323" : "#fafbfc",
                transition:
                  "box-shadow 0.2s, border-color 0.2s, background 0.2s",
                cursor: opening.available ? "pointer" : "not-allowed",
                opacity: opening.available ? 1 : 0.6,
                "&:hover": opening.available
                  ? {
                      boxShadow: 6,
                      borderColor: "primary.main",
                      background: (theme) =>
                        theme.palette.mode === "dark" ? "#232323" : "#f0f7fa",
                    }
                  : {},
              }}
              onClick={
                opening.available ? () => handleChoose(opening.key) : undefined
              }
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                {opening.name}
              </Typography>
              {opening.description && (
                <Typography variant="body2" color="text.secondary">
                  {opening.description}
                </Typography>
              )}
            </Paper>
          ))}
        </Stack>
      </Box>
    </>
  );
}
