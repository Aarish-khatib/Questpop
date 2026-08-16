import ComicBurst from "./ComicBurst";

export default function CompletionScreen({
  goal,
  onRestart,
}) {
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
        onClick={onRestart}
      >
        + START ANOTHER QUEST
      </button>
    </section>
  );
}