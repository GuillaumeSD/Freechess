import { formatGameToDatabase } from "@/lib/chess";
import { GameEval } from "@/types/eval";
import { Game } from "@/types/game";
import { Chess } from "chess.js";
import { openDB, DBSchema, IDBPDatabase } from "idb";
import { atom, useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";

interface GameDatabaseSchema extends DBSchema {
  games: {
    value: Game;
    key: number;
  };
}

const gamesAtom = atom<Game[]>([]);
const fetchGamesAtom = atom<boolean>(false);

export const useGameDatabase = (shouldFetchGames?: boolean) => {
  const [db, setDb] = useState<IDBPDatabase<GameDatabaseSchema> | null>(null);
  const [games, setGames] = useAtom(gamesAtom);
  const [fetchGames, setFetchGames] = useAtom(fetchGamesAtom);

  useEffect(() => {
    if (shouldFetchGames !== undefined) {
      setFetchGames(shouldFetchGames);
    }
  }, [shouldFetchGames, setFetchGames]);

  useEffect(() => {
    const initDatabase = async () => {
      const db = await openDB<GameDatabaseSchema>("games", 1, {
        upgrade(db) {
          db.createObjectStore("games", { keyPath: "id", autoIncrement: true });
        },
      });
      setDb(db);
    };

    initDatabase();
  }, []);

  const loadGames = useCallback(async () => {
    if (db && fetchGames) {
      const games = await db.getAll("games");
      setGames(games);
    }
  }, [db, fetchGames, setGames]);

  useEffect(() => {
    loadGames();
  }, [loadGames]);

  const addGame = async (game: Chess) => {
    if (!db) throw new Error("Database not initialized");

    const gameToAdd = formatGameToDatabase(game);
    await db.add("games", gameToAdd as Game);

    loadGames();
  };

  const setGameEval = async (gameId: number, evaluation: GameEval) => {
    if (!db) throw new Error("Database not initialized");

    const game = await db.get("games", gameId);
    if (!game) throw new Error("Game not found");

    await db.put("games", { ...game, eval: evaluation });

    loadGames();
  };

  const getGame = async (gameId: number) => {
    if (!db) return undefined;

    return db.get("games", gameId);
  };

  const deleteGame = async (gameId: number) => {
    if (!db) throw new Error("Database not initialized");

    await db.delete("games", gameId);

    loadGames();
  };

  const isReady = db !== null;

  return { addGame, setGameEval, getGame, deleteGame, games, isReady };
};
