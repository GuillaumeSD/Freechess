import { Chess } from "chess.js";
import { PrimitiveAtom, useAtomValue } from "jotai";
import { useGameDatabase } from "./useGameDatabase";
import { useState, useEffect } from "react";

export const usePlayersNames = (gameAtom: PrimitiveAtom<Chess>) => {
  const game = useAtomValue(gameAtom);
  const { gameFromUrl } = useGameDatabase();
  const headers = game.getHeaders();

  const headersWhiteName =
    headers.White && headers.White !== "?" ? headers.White : undefined;
  const headersBlackName =
    headers.Black && headers.Black !== "?" ? headers.Black : undefined;

  const whiteName = gameFromUrl?.white?.name || headersWhiteName || "White";
  const blackName = gameFromUrl?.black?.name || headersBlackName || "Black";

  const whiteElo = gameFromUrl?.white?.rating || headers.WhiteElo || undefined;
  const blackElo = gameFromUrl?.black?.rating || headers.BlackElo || undefined;

  // Determine if this game came from Chess.com (via PGN header or URL)
  const siteHeader = gameFromUrl?.site || headers.Site || "";
  const isChessCom = siteHeader.toLowerCase().includes("chess.com");

  // Avatars fetched only for Chess.com games
  const [whiteAvatar, setWhiteAvatar] = useState<string | undefined>(undefined);
  const [blackAvatar, setBlackAvatar] = useState<string | undefined>(undefined);

  // Fetch white avatar
  useEffect(() => {
    if (isChessCom && whiteName && whiteName !== "White") {
      // Normalize and encode username
      const trimmedWhiteName = whiteName.trim().toLowerCase();
      const usernameParam = encodeURIComponent(trimmedWhiteName);
      fetch(`https://api.chess.com/pub/player/${usernameParam}`)
        .then((res) => res.json())
        .then((data) => setWhiteAvatar(data.avatar || undefined))
        .catch(() => {
          setWhiteAvatar(undefined);
        });
    } else {
      setWhiteAvatar(undefined);
    }
  }, [isChessCom, whiteName]);

  // Fetch black avatar
  useEffect(() => {
    if (isChessCom && blackName && blackName !== "Black") {
      // Normalize and encode username
      const trimmedBlackName = blackName.trim().toLowerCase();
      const usernameParamBlack = encodeURIComponent(trimmedBlackName);
      fetch(`https://api.chess.com/pub/player/${usernameParamBlack}`)
        .then((res) => res.json())
        .then((data) => setBlackAvatar(data.avatar || undefined))
        .catch(() => {
          setBlackAvatar(undefined);
        });
    } else {
      setBlackAvatar(undefined);
    }
  }, [isChessCom, blackName]);

  return {
    whiteName,
    blackName,
    whiteElo,
    blackElo,
    whiteAvatar,
    blackAvatar,
  };
};
