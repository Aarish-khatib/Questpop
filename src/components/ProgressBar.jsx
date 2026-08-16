export default function ProgressBar({
  currentIndex,
  totalSteps,
  progress,
}) {
  return (
    <div className="progress-card">
      <div className="progress-top">
        <span>QUEST PROGRESS</span>

        <strong>
          {Math.min(currentIndex + 1, totalSteps)}
          /{totalSteps}
        </strong>
      </div>

      <div
        className="progress-track"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={progress}
      >
        <div
          className="progress-fill"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <div className="progress-dots">
        {Array.from({
          length: totalSteps,
        }).map((_, index) => (
          <span
            key={index}
            className={`progress-dot ${
              index < currentIndex
                ? "finished"
                : index === currentIndex
                  ? "current"
                  : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
}