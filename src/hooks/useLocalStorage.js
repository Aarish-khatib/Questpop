import { useState } from "react";

export default function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const savedValue = localStorage.getItem(key);

      if (savedValue !== null) {
        return JSON.parse(savedValue);
      }

      return initialValue;
    } catch (error) {
      console.error("QuestPop storage read error:", error);
      return initialValue;
    }
  });

  function setValue(value) {
    setStoredValue((previousValue) => {
      const valueToStore =
        typeof value === "function"
          ? value(previousValue)
          : value;

      try {
        localStorage.setItem(
          key,
          JSON.stringify(valueToStore)
        );
      } catch (error) {
        console.error("QuestPop storage write error:", error);
      }

      return valueToStore;
    });
  }

  return [storedValue, setValue];
}