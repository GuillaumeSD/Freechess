import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { PropsWithChildren, useMemo } from "react";
import NavBar from "./NavBar";
import { red } from "@mui/material/colors";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function Layout({ children }: PropsWithChildren) {
  const [useDarkMode, setDarkMode] = useLocalStorage("useDarkMode", true);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: useDarkMode ? "dark" : "light",
          error: {
            main: red[400],
          },
          primary: {
            main: "#5d9948",
          },
          secondary: {
            main: useDarkMode ? "#424242" : "#ffffff",
          },
        },
      }),
    [useDarkMode]
  );

  if (useDarkMode === null) return null;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar
        darkMode={useDarkMode}
        switchDarkMode={() => setDarkMode((val) => !val)}
      />
      <main style={{ margin: "2em 2vw" }}>{children}</main>
    </ThemeProvider>
  );
}
