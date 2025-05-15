import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { useEffect, useState } from "react";
import NavMenu from "./NavMenu";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import NavLink from "@/components/NavLink";
import Image from "next/image";
import { useColorScheme } from "@mui/material";

export default function NavBar() {
  const { mode, setMode } = useColorScheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setDrawerOpen(false);
  }, [router.pathname]);

  const darkMode = mode === "dark";

  return (
    <Box sx={{ flexGrow: 1, display: "flex" }}>
      <AppBar
        position="static"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        style={{
          backgroundColor: darkMode ? "#19191c" : "white",
          color: darkMode ? "white" : "black",
        }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: "min(0.5vw, 0.6rem)" }}
            onClick={() => setDrawerOpen((val) => !val)}
          >
            <Icon icon="mdi:menu" />
          </IconButton>
          <Image
            src="/favicon-32x32.png"
            alt="Chesskit logo"
            width={32}
            height={32}
          />
          <NavLink href="/">
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                ml: 1,
                fontSize: { xs: "1rem", sm: "1.25rem" },
              }}
            >
              Chesskit
            </Typography>
          </NavLink>
          <IconButton
            color="inherit"
            onClick={() => window.open("https://discord.gg/Yr99abAcUr")}
          >
            <Icon icon="ri:discord-fill" />
          </IconButton>
          <IconButton
            color="inherit"
            sx={{ ml: "min(0.6rem, 0.8vw)" }}
            onClick={() =>
              window.open("https://github.com/GuillaumeSD/Chesskit")
            }
          >
            <Icon icon="mdi:github" />
          </IconButton>
          <IconButton
            sx={{ ml: "min(0.6rem, 0.8vw)" }}
            onClick={() => setMode(darkMode ? "light" : "dark")}
            color="inherit"
            edge="end"
          >
            {darkMode ? (
              <Icon icon="mdi:brightness-7" />
            ) : (
              <Icon icon="mdi:brightness-4" />
            )}
          </IconButton>
        </Toolbar>
      </AppBar>
      <NavMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </Box>
  );
}
