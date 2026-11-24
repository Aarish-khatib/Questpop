import { useEffect, useState } from "react";
import { FOCUS_SECONDS, formatCountdown, remainingMilliseconds, remainingSeconds } from "../utils/focusTimer.js";

const FOCUS_MS = FOCUS_SECONDS * 1000;

export default function FocusTimer() {
  const [remainingMs, setRemainingMs] = useState(FOCUS_MS);
  const [deadline, setDeadline] = useState(null);

  useEffect(() => {
    if (deadline === null) return undefined;
    const tick = () => {
      const next = remainingMilliseconds(deadline);
      setRemainingMs(next);
      if (next === 0) setDeadline(null);
    };
    tick();
    const interval = window.setInterval(tick, 250);
    return () => window.clearInterval(interval);
  }, [deadline]);

  function toggle() {
    if (deadline !== null) {
      // Preserve fractional seconds: repeated pause/resume must not extend the session.
      setRemainingMs(remainingMilliseconds(deadline));
      setDeadline(null);
    } else if (remainingMs > 0) {
      setDeadline(Date.now() + remainingMs);
    }
  }

  function reset() {
    setDeadline(null);
    setRemainingMs(FOCUS_MS);
  }

  const remaining = remainingSeconds(remainingMs, 0);
  const finished = remainingMs === 0;
  return (
    <section className="focus-timer" aria-label="Two-minute focus timer">
      <p className="focus-timer-title">NEED A PUSH? TRY JUST TWO MINUTES.</p>
      <output className="focus-timer-clock" aria-label={`${remaining} seconds remaining`}>
        {formatCountdown(remaining)}
      </output>
      <div className="focus-timer-actions">
        <button type="button" onClick={toggle} disabled={finished}>
          {deadline !== null ? "PAUSE" : remainingMs === FOCUS_MS ? "START 2 MIN" : "RESUME"}
        </button>
        <button type="button" onClick={reset}>RESET</button>
      </div>
      {finished && <p role="status">TWO MINUTES DONE! KEEP GOING OR START A QUEST.</p>}
    </section>
  );
}
