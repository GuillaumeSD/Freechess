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

  const [whiteAvatar, setWhiteAvatar] = useState<string | undefined>(undefined);
  const [blackAvatar, setBlackAvatar] = useState<string | undefined>(undefined);

  useEffect(() => {
    const site = gameFromUrl?.site || headers.Site;
    if (site && site.toLowerCase().includes("chess.com") && whiteName) {
      fetch(`https://api.chess.com/pub/player/${whiteName.toLowerCase()}`)
        .then((res) => res.json())
        .then((data) => data.avatar && setWhiteAvatar(data.avatar))
        .catch(() => {});
      fetch(`https://api.chess.com/pub/player/${blackName.toLowerCase()}`)
        .then((res) => res.json())
        .then((data) => data.avatar && setBlackAvatar(data.avatar))
        .catch(() => {});
    }
  }, [whiteName, blackName, gameFromUrl, headers.Site]);

  return {
    whiteName,
    blackName,
    whiteElo,
    blackElo,
    whiteAvatar,
    blackAvatar,
  };
};
