import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  useTheme,
} from "@mui/material";
import { Icon } from "@iconify/react";

const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
const ranks = [8, 7, 6, 5, 4, 3, 2, 1];

const timeControls = [
  { label: "30 seconds", value: 30 },
  { label: "1 minute", value: 60 },
  { label: "2 minutes", value: 120 },
  { label: "5 minutes", value: 300 },
  { label: "Unlimited", value: 0 },
];

const getRandomSquare = () => {
  const file = files[Math.floor(Math.random() * 8)];
  const rank = ranks[Math.floor(Math.random() * 8)];
  return `${file}${rank}`;
};

interface GameSettings {
  timeControl: number;
  boardColor: "random" | "white" | "black";
  showCoordinates: boolean;
}

/*
1. This page itself does not need a complete chess board with piece movements. So for now we have just implemented a simple board.
2. In the future when the board optimization is complete it may or maynot be updated in the future.
3. I didn't feel that rendering pieces was necessary however we can add an option for that so that the user can just choose if they want pieces or not.
4. We can use Atomstorage to keep track of the best score for the user.
*/
export default function CoordinateTrainer() {
  const theme = useTheme();
  const [gameState, setGameState] = useState<
    "setup" | "playing" | "paused" | "finished"
  >("setup");
  const [settings, setSettings] = useState<GameSettings>({
    timeControl: 60,
    boardColor: "white",
    showCoordinates: false,
  });
  const [targetSquare, setTargetSquare] = useState(getRandomSquare());
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [wrongAnswer, setWrongAnswer] = useState(false);
  const [currentBoardOrientation, setCurrentBoardOrientation] = useState<
    "white" | "black"
  >("white");

  //* Timer Handling
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === "playing" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState("finished");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, timeLeft]);

  // Clear feedback after 2 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (feedback) {
      timer = setTimeout(() => setFeedback(null), 2000);
    }
    return () => clearTimeout(timer);
  }, [feedback]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(settings.timeControl);
    setTargetSquare(getRandomSquare());
    setGameState("playing");
    setFeedback(null);
    setWrongAnswer(false);

    // Set initial board orientation
    if (settings.boardColor === "random") {
      setCurrentBoardOrientation(Math.random() > 0.5 ? "white" : "black");
    } else {
      setCurrentBoardOrientation(settings.boardColor as "white" | "black");
    }
  };

  const pauseGame = () => {
    setGameState(gameState === "paused" ? "playing" : "paused");
  };

  const stopGame = () => {
    setGameState("setup");
    setScore(0);
    setTimeLeft(0);
    setFeedback(null);
  };

  const handleSquareClick = (square: string) => {
    if (gameState !== "playing") return;

    if (square === targetSquare) {
      setScore(score + 1);

      // We can use icons but inline emojis also seem to do the work just fine
      setFeedback({ message: "✅ Correct!", type: "success" });

      setWrongAnswer(false);

      // Only generate new target on correct answer
      setTargetSquare(getRandomSquare());

      // We can randomly choose board orientation if set to random after each successfull click
      // But for now the initial choosen value (b or w) be used through out each set. If not see the follow up code
      // if (settings.boardColor === "random") {
      //   setCurrentBoardOrientation(Math.random() > 0.5 ? "white" : "black")
      // }
    } else {
      setFeedback({
        message: "❌ Wrong! Try again",
        type: "error",
      });
      setWrongAnswer(true);
    }
  };

  //* Formats the time into minutes:seconds format
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  //* This func will be used to print the board
  const getSquareColor = (file: string, rank: number) => {
    const isLight = (files.indexOf(file) + ranks.indexOf(rank)) % 2 === 0;

    //* Since we have not implemented a board theme system for the whole application we can just set dark as light colors as follows These may be updated based on the board style:
    return isLight ? "#f0d9b5" : "#b58863";
  };

  //* Display the files on the side of the board
  const getDisplayFiles = () => {
    const orientation =
      settings.boardColor === "random"
        ? currentBoardOrientation
        : settings.boardColor;
    return orientation === "black" ? [...files].reverse() : files;
  };

  //* Display the ranks on the side of the board
  const getDisplayRanks = () => {
    const orientation =
      settings.boardColor === "random"
        ? currentBoardOrientation
        : settings.boardColor;
    return orientation === "black" ? [...ranks].reverse() : ranks;
  };

  //* This is the game setup dialog. used to choose time control color or coordinates settings
  if (gameState === "setup") {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          display: "flex",
          alignItems: "start",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Card sx={{ maxWidth: 500, width: "100%" }}>
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h4"
              gutterBottom
              align="center"
              color="primary"
            >
              Coordinate Trainer
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              align="center"
              sx={{ mb: 4 }}
            >
              Train your board vision by finding squares quickly
            </Typography>

            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Time Control</InputLabel>
                <Select
                  value={settings.timeControl}
                  label="Time Control"
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      timeControl: Number(e.target.value),
                    })
                  }
                >
                  {timeControls.map((control) => (
                    <MenuItem key={control.value} value={control.value}>
                      {control.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Board Orientation</InputLabel>
                <Select
                  value={settings.boardColor}
                  label="Board Orientation"
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      boardColor: e.target.value as
                        | "random"
                        | "white"
                        | "black",
                    })
                  }
                >
                  <MenuItem value="random">Choose Randomly</MenuItem>
                  <MenuItem value="white">White Side</MenuItem>
                  <MenuItem value="black">Black Side</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.showCoordinates}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        showCoordinates: e.target.checked,
                      })
                    }
                  />
                }
                label="Show coordinates in squares"
                sx={{ mb: 2 }}
              />
            </Box>

            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<Icon icon="material-symbols:play-arrow" />}
              onClick={startGame}
              sx={{ py: 1.5 }}
            >
              Start Training
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        bgcolor: "background.default",
      }}
    >
      {/* Left Side - Chess Board */}
      <Box
        sx={{
          flex: {
            md: 1,
          },
          display: "flex",
          alignItems: {
            xs: "start",
            md: "center",
          },
          justifyContent: "center",
          p: { xs: 1, sm: 2 },
          position: "relative",
          mb: 3,
        }}
      >
        {/* Board Container with Coordinates */}
        <Box
          sx={{
            position: "relative",
            maxWidth: {
              xs: "90vw",
              sm: "min(80vh, 80vw)",
              md: "min(80vh, 60vw)",
            },
            width: "100%",
            aspectRatio: "1",
          }}
        >
          {/* Rank Numbers (Left Side) */}
          <Box
            sx={{
              position: "absolute",
              left: { xs: -15, sm: -25 },
              top: 0,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              alignItems: "center",
              fontSize: { xs: "0.8rem", sm: "1rem" },
              fontWeight: "bold",
              color: "text.secondary",
            }}
          >
            {getDisplayRanks().map((rank) => (
              <Typography
                key={rank}
                sx={{ fontSize: "inherit", fontWeight: "inherit" }}
              >
                {rank}
              </Typography>
            ))}
          </Box>

          {/* File Letters (Bottom) */}
          <Box
            sx={{
              position: "absolute",
              bottom: { xs: -20, sm: -25 },
              left: 0,
              width: "100%",
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              fontSize: { xs: "0.8rem", sm: "1rem" },
              fontWeight: "bold",
              color: "text.secondary",
            }}
          >
            {getDisplayFiles().map((file) => (
              <Typography
                key={file}
                sx={{ fontSize: "inherit", fontWeight: "inherit" }}
              >
                {file}
              </Typography>
            ))}
          </Box>

          {/* Chess Board */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(8, 1fr)",
              gridTemplateRows: "repeat(8, 1fr)",
              border: `3px solid ${theme.palette.divider}`,
              borderRadius: 1,
              overflow: "hidden",
              width: "100%",
              height: "100%",
              boxShadow: theme.shadows[3],

              // Disable selection on the board like images or text selection etc
              userSelect: "none", // Standard property
              WebkitUserSelect: "none", // For Webkit browsers (Chrome, Safari)
              MozUserSelect: "none", // For Mozilla Firefox
              msUserSelect: "none", // For Microsoft Edge/IE (though less common now)
            }}
            // Prevent opening contexxt menu on right click
            onContextMenu={(e) => e.preventDefault()}
          >
            {getDisplayRanks().map((rank) =>
              getDisplayFiles().map((file) => {
                const square = `${file}${rank}`;

                return (
                  <Box
                    key={square}
                    onClick={() => handleSquareClick(square)}
                    sx={{
                      bgcolor: getSquareColor(file, rank),
                      display: "flex",
                      alignItems: settings.showCoordinates
                        ? "flex-end"
                        : "center",
                      justifyContent: settings.showCoordinates
                        ? "flex-start"
                        : "center",
                      cursor: gameState === "playing" ? "pointer" : "default",
                      position: "relative",
                      transition: "all 0.2s ease",
                      "&:hover":
                        gameState === "playing"
                          ? {
                              opacity: 0.8,
                              transform: "scale(0.95)",
                            }
                          : {},
                      fontSize: { xs: "0.6rem", sm: "0.8rem", md: "1rem" },
                      fontWeight: "bold",
                      color: settings.showCoordinates
                        ? "rgba(0,0,0,0.4)"
                        : "transparent",
                      p: settings.showCoordinates ? { xs: 0.3, sm: 0.5 } : 0,
                    }}
                  >
                    {settings.showCoordinates && square}
                  </Box>
                );
              })
            )}
          </Box>

          {/* Floating Target Square */}
          {gameState === "playing" && (
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: wrongAnswer
                  ? "rgba(220, 53, 69, 0.9)"
                  : "rgba(0, 0, 0, 0.8)",
                color: "white",
                borderRadius: 2,
                px: { xs: 2, sm: 3 },
                py: { xs: 1, sm: 1.5 },
                boxShadow: theme.shadows[8],
                zIndex: 10,
                pointerEvents: "none",
                transition: "background-color 0.3s ease",
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" },
                  fontWeight: "bold",
                  textAlign: "center",
                  lineHeight: 1,
                }}
              >
                {targetSquare}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Right Side - Game Info */}
      <Box
        sx={{
          width: { xs: "100%", md: 350 },
          height: { xs: "auto", md: "100vh" },
          bgcolor: "background.paper",
          borderLeft: { md: `1px solid ${theme.palette.divider}` },
          borderTop: { xs: `1px solid ${theme.palette.divider}`, md: "none" },
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography variant="h6" color="text.primary">
              Coordinate Trainer
            </Typography>
            <Box>
              <IconButton onClick={() => setShowSettings(true)} size="small">
                <Icon icon="material-symbols:settings" />
              </IconButton>
              <IconButton onClick={stopGame} size="small">
                <Icon icon="material-symbols:home" />
              </IconButton>
            </Box>
          </Box>

          {/* Timer and Score */}
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Chip
              label={`Score: ${score}`}
              color="primary"
              variant="outlined"
              sx={{ flex: 1 }}
            />
            {settings.timeControl > 0 && (
              <Chip
                label={formatTime(timeLeft)}
                color={timeLeft < 10 ? "error" : "default"}
                variant="outlined"
                sx={{ flex: 1 }}
              />
            )}
          </Box>

          {/* Progress Bar */}
          {settings.timeControl > 0 && (
            <LinearProgress
              variant="determinate"
              value={(timeLeft / settings.timeControl) * 100}
              sx={{
                mb: 2,
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)",
              }}
            />
          )}

          {/* Game Controls */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant={gameState === "paused" ? "contained" : "outlined"}
              startIcon={
                gameState === "paused" ? (
                  <Icon icon="material-symbols:play-arrow" />
                ) : (
                  <Icon icon="material-symbols:pause" />
                )
              }
              onClick={pauseGame}
              disabled={gameState === "finished"}
              size="small"
            >
              {gameState === "paused" ? "Resume" : "Pause"}
            </Button>
            <Button
              variant="outlined"
              startIcon={<Icon icon="material-symbols:stop" />}
              onClick={stopGame}
              size="small"
            >
              Stop
            </Button>
          </Box>
        </Box>

        {/* Game Status Display */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 2, sm: 4 },
            minHeight: { xs: "200px", md: "auto" },
          }}
        >
          {gameState === "playing" && !feedback && (
            <>
              <Typography variant="h5" color="text.secondary" gutterBottom>
                Find Square
              </Typography>
              <Typography variant="h6" color="text.secondary" align="center">
                Click on the highlighted square on the board
              </Typography>
            </>
          )}

          {gameState === "paused" && (
            <Typography variant="h4" color="text.secondary">
              Game Paused
            </Typography>
          )}

          {gameState === "finished" && (
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" color="primary.main" gutterBottom>
                Time's Up!
              </Typography>
              <Typography variant="h2" sx={{ mb: 2, color: "text.primary" }}>
                {score}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                squares found
              </Typography>
              <Button variant="contained" onClick={startGame}>
                Play Again
              </Button>
            </Box>
          )}

          {/* Feedback Display */}
          {feedback && feedback.type === "error" && (
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: "2rem", sm: "3rem" },
                  fontWeight: "bold",
                  color: "error.main",
                  mb: 2,
                }}
              >
                {feedback.message}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Keep trying to find {targetSquare}!
              </Typography>
            </Box>
          )}
          {feedback && feedback.type === "success" && (
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: "2rem", sm: "3rem" },
                  fontWeight: "bold",
                  color:
                    feedback.type === "success" ? "success.main" : "error.main",
                  mb: 2,
                }}
              >
                {feedback.message}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Next target coming up...
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Settings Dialog */}
      <Dialog
        open={showSettings}
        onClose={() => setShowSettings(false)}
        slotProps={{
          paper: {
            sx: {
              bgcolor: "background.paper",
              color: "text.primary",
            },
          },
        }}
      >
        <DialogTitle>Game Settings</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
            <InputLabel>Time Control</InputLabel>
            <Select
              value={settings.timeControl}
              label="Time Control"
              onChange={(e) =>
                setSettings({
                  ...settings,
                  timeControl: Number(e.target.value),
                })
              }
            >
              {timeControls.map((control) => (
                <MenuItem key={control.value} value={control.value}>
                  {control.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Board Orientation</InputLabel>
            <Select
              value={settings.boardColor}
              label="Board Orientation"
              onChange={(e) =>
                setSettings({
                  ...settings,
                  boardColor: e.target.value as "random" | "white" | "black",
                })
              }
            >
              <MenuItem value="random">Choose Randomly</MenuItem>
              <MenuItem value="white">White Side</MenuItem>
              <MenuItem value="black">Black Side</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={settings.showCoordinates}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    showCoordinates: e.target.checked,
                  })
                }
              />
            }
            label="Show coordinates in squares"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettings(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
