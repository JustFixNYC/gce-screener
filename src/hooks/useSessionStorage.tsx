import React from "react";

export const useSessionStorage = <T,>(keyName: string, defaultValue?: T):[T|undefined, (newValue: T) => void] => {
  const [storedValue, setStoredValue] = React.useState<T | undefined>(() => {
    try {
      const value = window.sessionStorage.getItem(keyName);

      if (value) {
        return (JSON.parse(value) as T);
      } else {
        window.sessionStorage.setItem(keyName, JSON.stringify(defaultValue));
        return defaultValue;
      }
    } catch {
      return defaultValue;
    }
  });

  const setValue = (newValue: T) => {
    try {
      window.sessionStorage.setItem(keyName, JSON.stringify(newValue));
    } finally {
      setStoredValue(newValue);
    }
  };

  return [storedValue, setValue];
};