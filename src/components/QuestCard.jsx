import { useState } from "react";
import ComicBurst from "./ComicBurst";
import Timer from "./Timer";

export default function QuestCard({
  goal,
  step,
  currentIndex,
  totalSteps,
  onComplete,
}) {
  const [copyStatus, setCopyStatus] = useState("");

  async function copyStep() {
    const text = `Goal: ${goal}\nStep ${currentIndex + 1} of ${totalSteps}: ${step.title}\n${step.detail}\nEstimated time: ${step.minutes} minutes`;
    if (!navigator.clipboard?.writeText) {
      setCopyStatus("Clipboard unavailable. Select the step text to copy it.");
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus("Step copied to clipboard.");
    } catch {
      setCopyStatus("Copy failed. Select the step text to copy it.");
    }
  }

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

      <button type="button" onClick={copyStep} aria-label="Copy current quest step">
        COPY STEP
      </button>
      <p role="status" aria-live="polite">{copyStatus}</p>

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