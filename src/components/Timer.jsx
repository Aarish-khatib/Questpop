import useTimer from "../hooks/useTimer";

function formatTime(totalSeconds) {
  const minutes = Math.floor(
    totalSeconds / 60
  );

  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
}

export default function Timer({
  minutes = 10,
}) {
  const {
    secondsLeft,
    isRunning,
    start,
    pause,
    reset,
  } = useTimer(minutes * 60);

  const finished = secondsLeft === 0;

  return (
    <div
      className={`timer ${
        isRunning ? "timer-running" : ""
      }`}
    >
      <div className="timer-header">
        <span>⚡ FOCUS ATTACK</span>

        <button
          type="button"
          onClick={reset}
          className="timer-reset"
        >
          RESET
        </button>
      </div>

      <div
        className="timer-time"
        role={finished ? "status" : "timer"}
        aria-label={finished ? "Focus timer finished" : `Focus timer: ${Math.floor(secondsLeft / 60)} minutes and ${secondsLeft % 60} seconds remaining`}
      >
        {finished
          ? "DONE!"
          : formatTime(secondsLeft)}
      </div>

      <div className="timer-controls">
        {!isRunning && !finished && (
          <button
            type="button"
            className="timer-main-button"
            onClick={start}
          >
            ▶ START TIMER
          </button>
        )}

        {isRunning && (
          <button
            type="button"
            className="timer-main-button"
            onClick={pause}
          >
            ⏸ PAUSE
          </button>
        )}

        {finished && (
          <button
            type="button"
            className="timer-main-button"
            onClick={reset}
          >
            ↻ AGAIN
          </button>
        )}
      </div>
    </div>
  );
}