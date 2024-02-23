import { useGameDatabase } from "@/hooks/useGameDatabase";
import { Icon } from "@iconify/react";
import { IconButton } from "@mui/material";
import { useAtomValue } from "jotai";
import { useRouter } from "next/router";
import { gameAtom, gameEvalAtom } from "../states";

export default function SaveButton() {
  const game = useAtomValue(gameAtom);
  const gameEval = useAtomValue(gameEvalAtom);
  const { addGame, setGameEval } = useGameDatabase();

  const router = useRouter();
  const { gameId } = router.query;

  const isButtonEnabled = router.isReady && typeof gameId === undefined;

  const handleSave = async () => {
    if (!isButtonEnabled) return;

    const gameId = await addGame(game);
    if (gameEval) {
      await setGameEval(gameId, gameEval);
    }

    router.replace(
      {
        query: { gameId: gameId },
        pathname: router.pathname,
      },
      undefined,
      { shallow: true, scroll: false }
    );
  };

  return (
    <IconButton onClick={handleSave} disabled={!isButtonEnabled}>
      <Icon icon="ri:save-3-line" />
    </IconButton>
  );
}
