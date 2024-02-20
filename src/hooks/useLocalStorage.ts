import { Dispatch, SetStateAction, useEffect, useState } from "react";

type SetValue<T> = Dispatch<SetStateAction<T>>;

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, SetValue<T>] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    const item = window.localStorage.getItem(key);
    if (item) {
      setStoredValue(parseJSON<T>(item));
    }
  }, [key]);

  const setValue: SetValue<T> = (value) => {
    const newValue = value instanceof Function ? value(storedValue) : value;
    window.localStorage.setItem(key, JSON.stringify(newValue));
    setStoredValue(newValue);
  };

  return [storedValue, setValue];
}

function parseJSON<T>(value: string): T {
  return value === "undefined" ? undefined : JSON.parse(value);
}
