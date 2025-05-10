import { Chess } from "chess.js";
import { PrimitiveAtom, useAtomValue } from "jotai";
import { useGameDatabase } from "./useGameDatabase";
import { useQuery } from "@tanstack/react-query";
import { getChessComUserAvatar } from "@/lib/chessCom";
import { Player } from "@/types/game";

export const usePlayersData = (
  gameAtom: PrimitiveAtom<Chess>
): { white: Player; black: Player } => {
  const game = useAtomValue(gameAtom);
  const { gameFromUrl } = useGameDatabase();
  const headers = game.getHeaders();

  const headersWhiteName =
    headers.White && headers.White !== "?" ? headers.White : undefined;
  const headersBlackName =
    headers.Black && headers.Black !== "?" ? headers.Black : undefined;

  const whiteName = gameFromUrl?.white?.name || headersWhiteName || "White";
  const blackName = gameFromUrl?.black?.name || headersBlackName || "Black";

  const whiteElo =
    gameFromUrl?.white?.rating || Number(headers.WhiteElo) || undefined;
  const blackElo =
    gameFromUrl?.black?.rating || Number(headers.BlackElo) || undefined;

  const siteHeader = gameFromUrl?.site || headers.Site || "unknown";
  const isChessCom = siteHeader.toLowerCase().includes("chess.com");

  const whiteAvatarUrl = usePlayerAvatarUrl(
    whiteName,
    isChessCom && !!whiteName && whiteName !== "White"
  );

  const blackAvatarUrl = usePlayerAvatarUrl(
    blackName,
    isChessCom && !!blackName && blackName !== "Black"
  );

  return {
    white: {
      name: whiteName,
      rating: whiteElo,
      avatarUrl: whiteAvatarUrl ?? undefined,
    },
    black: {
      name: blackName,
      rating: blackElo,
      avatarUrl: blackAvatarUrl ?? undefined,
    },
  };
};

const usePlayerAvatarUrl = (
  playerName: string,
  enabled: boolean
): string | null | undefined => {
  const { data: avatarUrl } = useQuery({
    queryKey: ["CCAvatar", playerName],
    enabled,
    queryFn: () => getChessComUserAvatar(playerName),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 1 day
  });

  return avatarUrl;
};
