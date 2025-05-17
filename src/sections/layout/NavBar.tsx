import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { useEffect, useState, useCallback } from "react";
import NavMenu from "./NavMenu";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import NavLink from "@/components/NavLink";
import Image from "next/image";

interface Props {
  darkMode: boolean;
  switchDarkMode: () => void;
}

export default function NavBar({ darkMode, switchDarkMode }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setDrawerOpen(false);
  }, [router.pathname]);

  const handleIconClick = useCallback((url: string, event: React.MouseEvent) => {
    if (event.button === 0 || event.button === 1) {
      // Left click (0) or middle click (1)
      window.open(url, "_blank", "noopener,noreferrer");
      if (event.button === 0) {
        // If left click, focus the new tab
        window.focus();
      }
    }
  }, []);

  return (
    <Box sx={{ flexGrow: 1, display: "flex" }}>
      <AppBar
        position="static"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: darkMode ? "#19191c" : "white",
          color: darkMode ? "white" : "black",
        }}
        enableColorOnDark
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
            onClick={(event) =>
              handleIconClick("https://discord.gg/Yr99abAcUr", event)
            }
          >
            <Icon icon="ri:discord-fill" />
          </IconButton>
          <IconButton
            color="inherit"
            sx={{ ml: "min(0.6rem, 0.8vw)" }}
            onClick={(event) =>
              handleIconClick("https://github.com/GuillaumeSD/Chesskit", event)
            }
          >
            <Icon icon="mdi:github" />
          </IconButton>
          <IconButton
            sx={{ ml: "min(0.6rem, 0.8vw)" }}
            onClick={switchDarkMode}
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
