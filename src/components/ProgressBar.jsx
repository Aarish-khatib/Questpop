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
        aria-label="Quest completion"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={Math.max(0, Math.min(100, Number(progress) || 0))}
        aria-valuetext={`${Math.max(0, Math.min(currentIndex, totalSteps))} of ${totalSteps} missions completed`}
      >
        <div
          className="progress-fill"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <div className="progress-dots" aria-hidden="true">
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