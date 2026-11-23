import { useEffect, useState } from "react";
import { FOCUS_SECONDS, formatCountdown, remainingSeconds } from "../utils/focusTimer.js";

export default function FocusTimer() {
  const [remaining, setRemaining] = useState(FOCUS_SECONDS);
  const [deadline, setDeadline] = useState(null);

  useEffect(() => {
    if (deadline === null) return undefined;
    const tick = () => {
      const next = remainingSeconds(deadline);
      setRemaining(next);
      if (next === 0) setDeadline(null);
    };
    tick();
    const interval = window.setInterval(tick, 250);
    return () => window.clearInterval(interval);
  }, [deadline]);

  function toggle() {
    if (deadline !== null) {
      setRemaining(remainingSeconds(deadline));
      setDeadline(null);
    } else {
      setDeadline(Date.now() + remaining * 1000);
    }
  }

  function reset() {
    setDeadline(null);
    setRemaining(FOCUS_SECONDS);
  }

  const finished = remaining === 0;
  return (
    <section className="focus-timer" aria-label="Two-minute focus timer">
      <p className="focus-timer-title">NEED A PUSH? TRY JUST TWO MINUTES.</p>
      <output className="focus-timer-clock" aria-label={`${remaining} seconds remaining`}>
        {formatCountdown(remaining)}
      </output>
      <div className="focus-timer-actions">
        <button type="button" onClick={toggle} disabled={finished}>
          {deadline !== null ? "PAUSE" : remaining === FOCUS_SECONDS ? "START 2 MIN" : "RESUME"}
        </button>
        <button type="button" onClick={reset}>RESET</button>
      </div>
      {finished && <p role="status">TWO MINUTES DONE! KEEP GOING OR START A QUEST.</p>}
    </section>
  );
}
