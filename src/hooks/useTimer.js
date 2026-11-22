import { useEffect, useRef, useState } from "react";

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
      const remaining = Math.max(
        0,
        Math.ceil((deadlineRef.current - Date.now()) / 1000)
      );
      setSecondsLeft(remaining);
      if (remaining === 0) {
        deadlineRef.current = null;
        setIsRunning(false);
      }
    };

    update();
    // The UI displays whole seconds; polling four times a second adds\n    // unnecessary work. Visibility changes still force an immediate refresh.\n    const interval = window.setInterval(update, 1000);
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
    const remaining = Math.max(
      0,
      Math.ceil((deadlineRef.current - Date.now()) / 1000)
    );
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
