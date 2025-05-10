import { Dispatch, SetStateAction, useEffect, useState } from "react";

type SetValue<T> = Dispatch<SetStateAction<T>>;

export function useLocalStorage<T = string | number | boolean>(
  key: string,
  initialValue: T
): [T | null, SetValue<T>] {
  const [storedValue, setStoredValue] = useState<T | null>(null);

  useEffect(() => {
    const item = window.localStorage.getItem(key);
    if (item) {
      const value = parseJSON<T>(item);
      if (value) {
        setStoredValue(value);
        return;
      }
    }
    setStoredValue(initialValue);
  }, [key, initialValue]);

  const setValue: SetValue<T> = (value) => {
    if (storedValue === null)
      throw new Error("setLocalStorage value isn't ready yet");
    const newValue = value instanceof Function ? value(storedValue) : value;
    window.localStorage.setItem(key, JSON.stringify(newValue));
    setStoredValue(newValue);
  };

  return [storedValue, setValue];
}

function parseJSON<T>(value: string): T | undefined {
  return value === "undefined" ? undefined : JSON.parse(value);
}
