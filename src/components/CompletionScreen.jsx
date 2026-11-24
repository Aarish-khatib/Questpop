import { createCompletionCard } from "../utils/completionCard.js";

import ComicBurst from "./ComicBurst";

export default function CompletionScreen({
  goal,
  onRestart,
}) {
  function downloadCard() {
    try {
      const svg = createCompletionCard(goal);
      const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = "questpop-complete.svg";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch {
      window.alert("Could not prepare your completion card.");
    }
  }

  return (
    <section className="completion-screen">
      <ComicBurst
        text="BOOM!"
        className="completion-burst-left"
      />

      <ComicBurst
        text="GG!"
        className="completion-burst-right"
      />

      <div className="completion-icon">
        🏆
      </div>

      <div className="completion-tag">
        QUEST COMPLETE
      </div>

      <h1>
        YOU ACTUALLY
        <br />
        <span>DID THE THING.</span>
      </h1>

      <p>
        You moved
        {" "}
        <strong>{goal}</strong>
        {" "}
        forward instead of sitting there
        thinking about it.
      </p>

      <div className="completion-card">
        <span>⚡ MOMENTUM CREATED</span>
        <span>✓ 3 MISSIONS CLEARED</span>
        <span>🧠 OVERTHINKING DEFEATED</span>
      </div>

      <button
        type="button"
        className="restart-button"
        onClick={downloadCard}
      >
        ↓ SAVE COMPLETION CARD
      </button>

      <button
        type="button"
        className="restart-button"
        onClick={onRestart}
      >
        + START ANOTHER QUEST
      </button>
    </section>
  );
}