import { useCallback, useState } from "react";

export const useLocalStorage = (key: string) => {
  const [storedValue, setStoredValue] = useState(
    () => localStorage.getItem(key) ?? "",
  );

  const setValue = useCallback(
    (value: string) => {
      localStorage.setItem(key, value);
      setStoredValue(value);
    },
    [key],
  );

  return [storedValue, setValue] as const;
};
