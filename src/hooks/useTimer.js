import {
  useEffect,
  useState,
} from "react";

export default function useTimer(initialSeconds = 600) {
  const [secondsLeft, setSecondsLeft] =
    useState(initialSeconds);

  const [isRunning, setIsRunning] =
    useState(false);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
    setIsRunning(false);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    if (secondsLeft <= 0) {
      setIsRunning(false);
      return undefined;
    }

    const interval = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          setIsRunning(false);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [isRunning, secondsLeft]);

  function start() {
    if (secondsLeft > 0) {
      setIsRunning(true);
    }
  }

  function pause() {
    setIsRunning(false);
  }

  function reset() {
    setIsRunning(false);
    setSecondsLeft(initialSeconds);
  }

  return {
    secondsLeft,
    isRunning,
    start,
    pause,
    reset,
  };
}