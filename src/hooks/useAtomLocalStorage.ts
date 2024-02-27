import { PrimitiveAtom, SetStateAction, useAtom } from "jotai";
import { useEffect, useState } from "react";

export function useAtomLocalStorage<T>(
  key: string,
  atom: PrimitiveAtom<T>
): [T, (value: SetStateAction<T>) => void] {
  const [keyTemp, setKeyTemp] = useState("");
  const [storedValue, setStoredValue] = useAtom(atom);

  useEffect(() => {
    const item = window.localStorage.getItem(key);
    if (item) {
      setStoredValue(parseJSON<T>(item));
    }
    setKeyTemp(key);
  }, [key, setStoredValue]);

  useEffect(() => {
    if (keyTemp !== key) return;
    window.localStorage.setItem(key, JSON.stringify(storedValue));
  }, [key, keyTemp, storedValue]);

  return [storedValue, setStoredValue];
}

function parseJSON<T>(value: string): T {
  return value === "undefined" ? undefined : JSON.parse(value);
}
