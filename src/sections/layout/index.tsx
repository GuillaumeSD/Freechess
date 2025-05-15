import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { PropsWithChildren } from "react";
import NavBar from "./NavBar";
import { red } from "@mui/material/colors";

const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        error: {
          main: red[400],
        },
        primary: {
          main: "#5d9948",
        },
        secondary: {
          main: "#ffffff",
        },
      },
    },
    dark: {
      palette: {
        error: {
          main: red[400],
        },
        primary: {
          main: "#5d9948",
        },
        secondary: {
          main: "#424242",
        },
      },
    },
  },
});

export default function Layout({ children }: PropsWithChildren) {
  return (
    <ThemeProvider theme={theme} defaultMode="dark" noSsr>
      <CssBaseline />
      <NavBar />
      <main style={{ margin: "3vh 2vw" }}>{children}</main>
    </ThemeProvider>
  );
}
