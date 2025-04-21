import { useChessActions } from "@/hooks/useChessActions";
import Board from "@/sections/analysis/board";
import PanelHeader from "@/sections/analysis/panelHeader";
import PanelToolBar from "@/sections/analysis/panelToolbar";
import AnalysisTab from "@/sections/analysis/panelBody/analysisTab";
import ClassificationTab from "@/sections/analysis/panelBody/classificationTab";
import {
  boardAtom,
  boardOrientationAtom,
  gameAtom,
  gameEvalAtom,
} from "@/sections/analysis/states";
import {
  Box,
  Divider,
  Grid2 as Grid,
  Tab,
  Tabs,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import EngineSettingsButton from "@/sections/engineSettings/engineSettingsButton";
import GraphTab from "@/sections/analysis/panelBody/graphTab";
import { PageTitle } from "@/components/pageTitle";

export default function GameReview() {
  const theme = useTheme();
  const [tab, setTab] = useState(0);
  const isLgOrGreater = useMediaQuery(theme.breakpoints.up("lg"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { reset: resetBoard } = useChessActions(boardAtom);
  const { reset: resetGame } = useChessActions(gameAtom);
  const [gameEval, setGameEval] = useAtom(gameEvalAtom);
  const game = useAtomValue(gameAtom);
  const setBoardOrientation = useSetAtom(boardOrientationAtom);

  const router = useRouter();
  const { gameId } = router.query;

  useEffect(() => {
    if (!gameId) {
      resetBoard();
      setGameEval(undefined);
      setBoardOrientation(true);
      resetGame({ noHeaders: true });
    }
  }, [gameId, setGameEval, setBoardOrientation, resetBoard, resetGame]);

  const isGameLoaded = game.history().length > 0;

  useEffect(() => {
    if (tab === 1 && !isGameLoaded) setTab(0);
    if (tab === 2 && !gameEval) setTab(0);
  }, [isGameLoaded, gameEval, tab]);

  return (
    <Grid container gap={4} justifyContent="space-evenly" alignItems="start">
      <PageTitle title="Chesskit Game Review" />

      <Board />

      <Grid
        container
        justifyContent="center"
        alignItems="center"
        borderRadius={2}
        border={1}
        borderColor={"secondary.main"}
        sx={{
          backgroundColor: "secondary.main",
          borderColor: "primary.main",
          borderWidth: 2,
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
        }}
        padding={2.5}
        style={{
          maxWidth: "1200px",
        }}
        rowGap={2}
        maxHeight={{ lg: "calc(95vh - 130px)", xs: "900px" }}
        display="grid"
        gridTemplateRows="repeat(4, auto) fit-content(100%)"
        marginTop={isLgOrGreater && window.innerHeight > 780 ? 4 : 0}
        size={{
          xs: 12,
          lg: "grow",
        }}
      >
        {isLgOrGreater ? (
          <PanelHeader key="analysis-panel-header" />
        ) : (
          <PanelToolBar key="review-panel-toolbar" />
        )}

        {!isLgOrGreater && !gameEval && <Divider sx={{ marginX: "5%" }} />}
        {!isLgOrGreater && !gameEval && (
          <PanelHeader key="analysis-panel-header" />
        )}

        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            marginX: { sm: "5%", xs: undefined },
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, newValue) => setTab(newValue)}
            aria-label="basic tabs example"
            variant="fullWidth"
          >
            <Tab
              label="Analysis"
              id="tab0"
              icon={
                <Icon
                  icon="mdi:magnify"
                  color="#27f019"
                  height={isMobile ? 15 : 20}
                />
              }
              iconPosition="start"
              sx={{ textTransform: "none", minHeight: 20, paddingX: 0 }}
              disableFocusRipple
            />

            <Tab
              label="Moves"
              id="tab1"
              icon={
                <Icon
                  icon="mdi:format-list-bulleted"
                  color="#27f019"
                  height={isMobile ? 15 : 20}
                />
              }
              iconPosition="start"
              sx={{
                textTransform: "none",
                minHeight: 20,
                display: isGameLoaded ? undefined : "none",
                paddingX: 0,
              }}
              disableFocusRipple
            />

            <Tab
              label="Graph"
              id="tab2"
              icon={
                <Icon
                  icon="mdi:chart-line"
                  color="#27f019"
                  height={isMobile ? 15 : 20}
                />
              }
              iconPosition="start"
              sx={{
                textTransform: "none",
                minHeight: 20,
                display: gameEval ? undefined : "none",
                paddingX: 0,
              }}
              disableFocusRipple
            />
          </Tabs>
        </Box>

        <AnalysisTab role="tabpanel" hidden={tab !== 0} id="tabContent0" />

        <ClassificationTab
          role="tabpanel"
          hidden={tab !== 1}
          id="tabContent1"
        />

        <GraphTab role="tabpanel" hidden={tab !== 2} id="tabContent2" />

        {isLgOrGreater && <Divider sx={{ marginX: "5%" }} />}
        {isLgOrGreater && <PanelToolBar key="review-panel-toolbar" />}

        {!isLgOrGreater && gameEval && <Divider sx={{ marginX: "5%" }} />}
        {!isLgOrGreater && gameEval && (
          <PanelHeader key="analysis-panel-header" />
        )}
      </Grid>

      <EngineSettingsButton />
    </Grid>
  );
}
