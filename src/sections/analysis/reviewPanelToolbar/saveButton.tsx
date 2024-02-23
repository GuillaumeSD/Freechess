import { useGameDatabase } from "@/hooks/useGameDatabase";
import { Icon } from "@iconify/react";
import { IconButton } from "@mui/material";
import { useAtomValue } from "jotai";
import { useRouter } from "next/router";
import { gameAtom } from "../states";

export default function SaveButton() {
  const game = useAtomValue(gameAtom);
  const { addGame } = useGameDatabase();

  const router = useRouter();
  const { gameId } = router.query;

  const isButtonEnabled = router.isReady && typeof gameId === undefined;

  return (
    <IconButton
      onClick={async () => {
        if (!isButtonEnabled) return;
        const gameId = await addGame(game);
        router.replace(
          {
            query: { gameId: gameId },
            pathname: router.pathname,
          },
          undefined,
          { shallow: true, scroll: false }
        );
      }}
      disabled={!isButtonEnabled}
    >
      <Icon icon="ri:save-3-line" />
    </IconButton>
  );
}
