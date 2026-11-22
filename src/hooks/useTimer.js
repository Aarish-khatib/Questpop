import { useEffect, useRef, useState } from "react";
import { secondsUntil } from "../utils/timerClock.js";

export default function useTimer(initialSeconds = 600) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const deadlineRef = useRef(null);

  useEffect(() => {
    deadlineRef.current = null;
    setSecondsLeft(initialSeconds);
    setIsRunning(false);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isRunning) return undefined;

    // Count elapsed wall-clock time, not interval callbacks. Browsers throttle
    // intervals in background tabs, so subtracting one per tick drifts badly.
    const update = () => {
      const remaining = secondsUntil(deadlineRef.current);
      setSecondsLeft(remaining);
      if (remaining === 0) {
        deadlineRef.current = null;
        setIsRunning(false);
      }
    };

    update();
    // Whole-second display needs at most one update per second.
    // Visibility changes trigger an immediate refresh.
    const interval = window.setInterval(update, 1000);
    const onVisibilityChange = () => update();
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [isRunning]);

  function start() {
    if (isRunning || secondsLeft <= 0) return;
    deadlineRef.current = Date.now() + secondsLeft * 1000;
    setIsRunning(true);
  }

  function pause() {
    if (!isRunning) return;
    const remaining = secondsUntil(deadlineRef.current);
    deadlineRef.current = null;
    setSecondsLeft(remaining);
    setIsRunning(false);
  }

  function reset() {
    deadlineRef.current = null;
    setIsRunning(false);
    setSecondsLeft(initialSeconds);
  }

  return { secondsLeft, isRunning, start, pause, reset };
}
