import ComicBurst from "./ComicBurst";
import Timer from "./Timer";

export default function QuestCard({
  goal,
  step,
  currentIndex,
  totalSteps,
  onComplete,
}) {
  if (!step) {
    return null;
  }

  return (
    <article
      className="active-quest-card"
      key={step.id}
    >
      <ComicBurst
        text={
          currentIndex === 0
            ? "POW!"
            : currentIndex === 1
              ? "BAM!"
              : "ZAP!"
        }
        className="quest-burst"
      />

      <div className="quest-meta">
        <span>
          MISSION {currentIndex + 1}
        </span>

        <span>
          {currentIndex + 1}/{totalSteps}
        </span>
      </div>

      <p className="current-goal">
        YOUR GOAL: {goal}
      </p>

      <h2>{step.title}</h2>

      <p className="quest-detail">
        {step.detail}
      </p>

      <div className="mission-time">
        <span>⏱</span>
        ABOUT {step.minutes} MIN
      </div>

      <Timer
        key={step.id}
        minutes={step.minutes}
      />

      <button
        className="done-button"
        type="button"
        onClick={onComplete}
      >
        <span>✓</span>

        {currentIndex === totalSteps - 1
          ? "FINISH QUEST"
          : "DONE! NEXT MOVE"}
      </button>
    </article>
  );
}