import { italianGameVariations } from "../data/openings to learn/italian";
import { Box } from "@mui/material";
import { useState, useMemo, useEffect, useCallback } from "react";
import Board from "../components/board";
import { Chess } from "chess.js";
import { atom, useAtom } from "jotai";
import { useChessActions } from "../hooks/useChessActions";
import { Color } from "../types/enums";
import { CurrentPosition } from "../types/eval";
import OpeningProgress from "../components/OpeningProgress";
import { Grid2 as Grid } from "@mui/material";
import { useScreenSize } from "../hooks/useScreenSize";
import EvaluationBar from "../components/board/evaluationBar";
import { useEngine } from "../hooks/useEngine";
import { EngineName } from "../types/enums";
import OpeningControls from "../components/OpeningControls";
import VariationHeader from "../components/VariationHeader";
import { useMistakeHandler } from "../hooks/useMistakeHandler";

// Returns the learning color for the variation (default is white, but can be extended)
function getLearningColor(): Color {
  // Always returns white for now
  return Color.White;
}

interface Mistake {
  from: string;
  to: string;
  type: string;
}

export default function OpeningPage() {
  const [currentVariantIdx, setCurrentVariantIdx] = useState<number>(0);
  const [moveIdx, setMoveIdx] = useState<number>(0);
  const [trainingMode, setTrainingMode] = useState<boolean>(false);
  const [lastMistakeVisible, setLastMistakeVisible] = useState<Mistake | null>(null);
  // Atom Jotai for game state
  const [gameAtomInstance] = useState(() => atom(new Chess()));
  const [game, setGame] = useAtom(gameAtomInstance);
  const { undoMove } = useChessActions(gameAtomInstance);

  // List of variations to learn (all)
  const variations = italianGameVariations;
  const selectedVariation = variations[currentVariantIdx] || null;

  // Learning color (fixed for the variation)
  const learningColor = useMemo(() => {
    if (!selectedVariation) return Color.White;
    return getLearningColor(); // No argument needed
  }, [selectedVariation]);

  // Indicates if it's the user's turn to play
  const isUserTurn = useMemo(() => {
    if (!selectedVariation) return false;
    // moveIdx % 2 === 0 => white, 1 => black (if the sequence starts with white)
    const colorToPlay = moveIdx % 2 === 0 ? Color.White : Color.Black;
    return colorToPlay === learningColor;
  }, [moveIdx, learningColor, selectedVariation]);

  // Generate the expected move in UCI format for the arrow (only if it's the user's turn to play)
  const bestMoveUci = useMemo(() => {
    if (
      selectedVariation &&
      game &&
      moveIdx < selectedVariation.moves.length
    ) {
      const chess = new Chess(game.fen());
      const san = selectedVariation.moves[moveIdx];
      const moves = chess.moves({ verbose: true });
      const moveObj = moves.find((m) => m.san === san);
      if (moveObj) {
        return moveObj.from + moveObj.to + (moveObj.promotion ? moveObj.promotion : "");
      }
    }
    return undefined;
  }, [selectedVariation, game, moveIdx, isUserTurn]);

  // Writable atom for currentPosition (read/write)
  // Instead of a local atom, use the engine evaluation mechanism already present in the project
  // (see useEngine, useGameData, or similar hooks if available)
  // Here, we use a simple effect to update the evaluation after each move using the engine
  const [currentPositionAtom, setCurrentPositionAtom] = useState(() => atom<CurrentPosition>({
    lastEval: { lines: [] },
    eval: { moveClassification: undefined, lines: [] },
  }));

  // Engine integration for real-time evaluation
  const engine = useEngine(EngineName.Stockfish17Lite);

  useEffect(() => {
    if (!game || !engine || !engine.getIsReady()) return;
    let cancelled = false;
    const fen = game.fen();
    // Delay the analysis to prioritize move animation
    const timeout = setTimeout(() => {
      if (cancelled) return;
      engine.evaluatePositionWithUpdate({
        fen,
        depth: 14,
        multiPv: 2,
        setPartialEval: (evalResult) => {
          if (!cancelled) {
            setCurrentPositionAtom(atom<CurrentPosition>({
              lastEval: evalResult,
              eval: evalResult,
            }));
          }
        },
      });
    }, 200); // 200ms allows time for move animation
    return () => {
      cancelled = true;
      clearTimeout(timeout);
      engine.stopAllCurrentJobs();
    };
  }, [game, moveIdx, engine]);

  // Reset on each variation or progression
  useEffect(() => {
    if (!selectedVariation) return;
    try {
      const chess = new Chess();
      for (let i = 0; i < moveIdx; i++) {
        const move = selectedVariation.moves[i];
        const result = chess.move(move);
        if (!result) break; // Stop if invalid move
      }
      setGame(chess);
    } catch (e) {
      // Error handling: avoid crash
      setGame(new Chess());
    }
  }, [selectedVariation, moveIdx, setGame]);

  // Validate user move: if wrong move, undo and annotate
  useEffect(() => {
    if (!selectedVariation || !game) return;
    if (moveIdx >= selectedVariation.moves.length) return;
    if (!isUserTurn) return; // Only validate user moves
    let mistakeTimeout: NodeJS.Timeout | null = null;
    let undoTimeout: NodeJS.Timeout | null = null;
    try {
      const history = game.history({ verbose: true });
      if (history.length !== moveIdx + 1) return;
      const last = history[history.length - 1];
      const expectedMove = new Chess();
      for (let i = 0; i < moveIdx; i++) expectedMove.move(selectedVariation.moves[i]);
      const expected = expectedMove.move(selectedVariation.moves[moveIdx]);
      if (!expected || last.from !== expected.from || last.to !== expected.to) {
        // Wrong move: wait 200ms before showing error icon, then undo after 1.5s
        let mistakeType = "Mistake";
        if (last.captured || last.san.includes("#")) mistakeType = "Blunder";
        // Do NOT set lastMistakeVisible immediately
        mistakeTimeout = setTimeout(() => {
          setLastMistakeVisible({ from: last.from, to: last.to, type: mistakeType });
        }, 200);
        undoTimeout = setTimeout(() => {
          setLastMistakeVisible(null);
          undoMove();
        }, 1500);
      } else {
        setLastMistakeVisible(null);
        setMoveIdx((idx) => idx + 1);
      }
    } catch (e) {
      setLastMistakeVisible(null);
    }
    return () => {
      if (mistakeTimeout) clearTimeout(mistakeTimeout);
      if (undoTimeout) clearTimeout(undoTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.history().length, trainingMode, selectedVariation, isUserTurn]);

  // Automatically advance opponent moves after a correct user move
  useEffect(() => {
    if (!selectedVariation) return;
    if (moveIdx >= selectedVariation.moves.length) return;
    // If it's not the user's turn, automatically advance opponent moves
    if (!isUserTurn) {
      // Play all opponent moves until the next user move or end of sequence
      let nextIdx = moveIdx;
      let colorToPlay = nextIdx % 2 === 0 ? Color.White : Color.Black;
      while (nextIdx < selectedVariation.moves.length && colorToPlay !== learningColor) {
        nextIdx++;
        colorToPlay = nextIdx % 2 === 0 ? Color.White : Color.Black;
      }
      if (nextIdx !== moveIdx) {
        // Delay increased to 500ms to allow time for user move animation
        setTimeout(() => setMoveIdx(nextIdx), 500);
      }
    }
  }, [moveIdx, isUserTurn, selectedVariation, learningColor]);

  // Automatically chain variations
  useEffect(() => {
    if (!selectedVariation) return;
    if (moveIdx >= selectedVariation.moves.length) {
      // Success: move to the next variation after a short delay
      if (currentVariantIdx < variations.length - 1) {
        setTimeout(() => {
          setCurrentVariantIdx((idx) => idx + 1);
          setMoveIdx(0);
        }, 800);
      }
    }
  }, [moveIdx, selectedVariation, currentVariantIdx, variations.length]);

  // If all variations are completed
  const allDone = currentVariantIdx >= variations.length;

  // Progress management (persisted by mode)
  const openingKey = "italian";
  const progressMode = trainingMode ? "training" : "learning";
  const progressStorageKey = `${openingKey}-progress-${progressMode}`;
  const [completedVariations, setCompletedVariations] = useState<number[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(progressStorageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Mark a variation as completed
  useEffect(() => {
    if (!selectedVariation) return;
    if (moveIdx >= selectedVariation.moves.length) {
      if (!completedVariations.includes(currentVariantIdx)) {
        const updated = [...completedVariations, currentVariantIdx];
        setCompletedVariations(updated);
        localStorage.setItem(progressStorageKey, JSON.stringify(updated));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moveIdx, selectedVariation, currentVariantIdx, progressMode]);

  // When loading, if there is a completed variation, jump to the first incomplete one
  useEffect(() => {
    if (completedVariations.length > 0 && completedVariations.length < variations.length) {
      // Find the first incomplete variation
      const firstIncomplete = variations.findIndex((_, idx) => !completedVariations.includes(idx));
      if (firstIncomplete !== -1 && currentVariantIdx !== firstIncomplete) {
        setCurrentVariantIdx(firstIncomplete);
        setMoveIdx(0);
        setLastMistakeVisible(null);
        setGame(new Chess());
      }
    } else if (completedVariations.length === variations.length && currentVariantIdx !== variations.length) {
      // All done, move to the end
      setCurrentVariantIdx(variations.length - 1); // Correction: do not exceed max index
      setMoveIdx(0);
      setLastMistakeVisible(null);
      setGame(new Chess());
    }
  }, [completedVariations, variations.length, currentVariantIdx, setGame]);

  // Reset progress
  const handleResetProgress = useCallback(() => {
    localStorage.removeItem(progressStorageKey);
    setCompletedVariations([]);
    setCurrentVariantIdx(0);
    setMoveIdx(0);
    setLastMistakeVisible(null);
    setGame(new Chess());
  }, [setCompletedVariations, setCurrentVariantIdx, setMoveIdx, setLastMistakeVisible, setGame]);

  // Determine the target square of the last move played (for overlay)
  const lastMoveSquare = useMemo(() => {
    if (!game) return null;
    const history = game.history({ verbose: true });
    if (history.length === 0) return null;
    const last = history[history.length - 1];
    return last.to;
  }, [game]);

  // Determine the type of icon to display (success/error)
  const trainingFeedback = useMemo(() => {
    if (!lastMoveSquare) return undefined;
    // Show red cross icon if the last move was incorrectly played by the human
    if (lastMistakeVisible && lastMistakeVisible.to === lastMoveSquare) {
      return { square: lastMoveSquare, icon: "/icons/mistake.png", alt: "Incorrect move" };
    }
    // Show nothing if the move is correct
    return undefined;
  }, [lastMistakeVisible, lastMoveSquare]);

  const screenSize = useScreenSize();
  // Responsive constants
  const evalBarWidth = 32; // px
  const evalBarGap = 8; // px

  // Dynamic board size calculation
  const boardSize = useMemo(() => {
    const { width, height } = screenSize;
    let maxBoardWidth = width - 300 - evalBarWidth;
    if (typeof window !== "undefined" && window.innerWidth < 900) {
      maxBoardWidth = width - evalBarWidth - 24;
      return Math.max(180, Math.min(maxBoardWidth, height - 150));
    }
    return Math.max(240, Math.min(maxBoardWidth, height * 0.83));
  }, [screenSize]);

  // Handler for skip variation
  const handleSkipVariation = useCallback(() => {
    let newCompleted = completedVariations;
    if (!completedVariations.includes(currentVariantIdx)) {
      newCompleted = [...completedVariations, currentVariantIdx];
      setCompletedVariations(newCompleted);
      localStorage.setItem(progressStorageKey, JSON.stringify(newCompleted));
    }
    if (currentVariantIdx < variations.length - 1) {
      setCurrentVariantIdx(idx => idx + 1);
      setMoveIdx(0);
      setLastMistakeVisible(null);
      setGame(new Chess());
    } else {
      setMoveIdx(0);
      setLastMistakeVisible(null);
      setGame(new Chess());
    }
  }, [completedVariations, currentVariantIdx, setCompletedVariations, setCurrentVariantIdx, setMoveIdx, setLastMistakeVisible, setGame, variations.length]);

  // Use mistake handler hook
  useMistakeHandler({
    selectedVariation,
    game,
    moveIdx,
    isUserTurn,
    setMoveIdx,
    setLastMistakeVisible,
    undoMove,
  });

  return (
    <Grid
      container
      gap={4}
      justifyContent="space-evenly"
      alignItems="start"
      sx={{
        minHeight: "100vh",
        width: "100vw",
        maxWidth: "100vw",
        m: 0,
        p: 0,
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      {/* Left area: evaluation bar + board */}
      <Grid
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: 0,
          ml: 0,
          height: { xs: "auto", sm: "85vh" },
          maxHeight: { xs: 380, sm: "none" },
        }}
      >
        {selectedVariation && !allDone && game && (
          <Box
            sx={{
              width: boardSize,
              height: boardSize,
              maxWidth: 600,
              maxHeight: 600,
              minWidth: { xs: 260, sm: 340, md: 400 },
              minHeight: { xs: 260, sm: 340, md: 400 },
              mx: "auto",
              position: "relative",
              aspectRatio: "1",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              mr: `${evalBarGap * 2}px`, // Right margin for visual balance
            }}
          >
            {/* Evaluation bar on the left, vertically centered */}
            <Box
              sx={{
                height: boardSize,
                width: evalBarWidth,
                minWidth: evalBarWidth,
                maxWidth: evalBarWidth,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: `${evalBarGap}px`,
                position: "relative",
                zIndex: 1,
              }}
            >
              <EvaluationBar
                height={boardSize}
                boardOrientation={learningColor}
                currentPositionAtom={currentPositionAtom}
              />
            </Box>
            {/* Chessboard */}
            <Box
              sx={{
                flex: "none",
                height: boardSize,
                minHeight: boardSize,
                maxHeight: boardSize,
                display: "flex",
                alignItems: "center",
                p: 0,
                m: 0,
              }}
            >
              <Board
                id="LearningBoard"
                canPlay
                gameAtom={gameAtomInstance}
                boardSize={boardSize}
                whitePlayer={{ name: "White" }}
                blackPlayer={{ name: "Black" }}
                showBestMoveArrow={!trainingMode && !!bestMoveUci && isUserTurn}
                bestMoveUci={bestMoveUci}
                currentPositionAtom={currentPositionAtom}
                boardOrientation={learningColor}
                trainingFeedback={trainingFeedback}
                hidePlayerHeaders={true}
              />
            </Box>
          </Box>
        )}
      </Grid>

      {/* Right area: progress panel, buttons, text */}
      <Grid
        sx={{
          minWidth: { md: 320 },
          maxWidth: 420,
          mb: { xs: 2, md: 0 },
          display: "flex",
          flexDirection: "column",
          height: "100%",
          flex: { xs: "none", md: 1 },
          px: { xs: 2, sm: 3, md: 4 },
          pt: { xs: 2, md: 4 },
          mr: { xs: 1, sm: 2, md: 6, lg: 10 },
          backgroundColor: "#424242", // Fond gris clair cohérent
          border: "2px solid", // Bord bleu
          borderColor: "primary.main",
          borderRadius: 2, // Coins arrondis
          boxShadow: 3, // Ombre cohérente
        }}
      >
        {/* Centered container for title and buttons */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 2,
            pt: 2,
            pb: 2,
          }}
        >
          <VariationHeader
            variationName={selectedVariation?.name}
            trainingMode={trainingMode}
            onSetTrainingMode={setTrainingMode}
            variationComplete={moveIdx >= (selectedVariation?.moves.length || 0)}
          />
        </Box>

        {/* Progress bar at the bottom right, always visible */}
        <Box
          sx={{
            mt: "auto",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            pb: 2,
          }}
        >
          <OpeningProgress
            total={variations.length}
            completed={completedVariations}
          />
          <OpeningControls
            moveIdx={moveIdx}
            selectedVariationMovesLength={selectedVariation?.moves.length || 0}
            allDone={allDone}
            onSkip={handleSkipVariation}
            onReset={handleResetProgress}
          />
        </Box>
      </Grid>
    </Grid>
  );
}
