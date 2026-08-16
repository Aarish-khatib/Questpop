import { energyLevels } from "../data/questTemplates.js";

function formatDate(timestamp) {
  if (!timestamp) {
    return "Unknown";
  }

  return new Date(timestamp).toLocaleString([], {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HistoryPanel({
  open,
  history,
  stats,
  onClose,
  onRemove,
  onClear,
}) {
  if (!open) {
    return null;
  }

  const safeHistory = Array.isArray(history)
    ? history
    : [];

  const safeStats = stats || {
    completed: 0,
    completedToday: 0,
    missionsCleared: 0,
    totalMinutes: 0,
  };

  function handleClear() {
    if (!safeHistory.length) {
      return;
    }

    const confirmed = window.confirm(
      "Clear all completed QuestPop history?"
    );

    if (confirmed) {
      onClear();
    }
  }

  return (
    <div
      className="history-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <aside
        className="history-panel"
        aria-label="Quest history"
      >
        <div className="history-header">
          <div>
            <span className="history-kicker">
              ⚡ YOUR RUN
            </span>

            <h2>
              QUEST <span>HISTORY</span>
            </h2>
          </div>

          <button
            type="button"
            className="history-close"
            onClick={onClose}
            aria-label="Close history"
          >
            ×
          </button>
        </div>

        <div className="history-stats">
          <div>
            <strong>
              {safeStats.completed}
            </strong>
            <span>QUESTS</span>
          </div>

          <div>
            <strong>
              {safeStats.completedToday}
            </strong>
            <span>TODAY</span>
          </div>

          <div>
            <strong>
              {safeStats.missionsCleared}
            </strong>
            <span>MISSIONS</span>
          </div>

          <div>
            <strong>
              {safeStats.totalMinutes}
            </strong>
            <span>FOCUS MIN</span>
          </div>
        </div>

        <div className="history-list-header">
          <span>COMPLETED QUESTS</span>

          {safeHistory.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
            >
              CLEAR ALL
            </button>
          )}
        </div>

        <div className="history-list">
          {safeHistory.length === 0 ? (
            <div className="history-empty">
              <div>🫥</div>

              <h3>NOTHING HERE YET.</h3>

              <p>
                Complete your first quest
                and it'll appear here.
              </p>
            </div>
          ) : (
            safeHistory.map((item, index) => {
              const energy =
                energyLevels[item.energy] ??
                energyLevels.normal;

              const steps = Array.isArray(item.steps)
                ? item.steps
                : [];

              const minutes = steps.reduce(
                (total, step) =>
                  total + (Number(step.minutes) || 0),
                0
              );

              return (
                <article
                  className="history-item"
                  key={item.id}
                >
                  <div className="history-number">
                    {String(
                      safeHistory.length - index
                    ).padStart(2, "0")}
                  </div>

                  <div className="history-item-main">
                    <div className="history-item-top">
                      <span className="history-energy">
                        {energy.emoji} {energy.label}
                      </span>

                      <span>
                        {formatDate(item.completedAt)}
                      </span>
                    </div>

                    <h3>
                      {item.goal || "Untitled quest"}
                    </h3>

                    <div className="history-item-bottom">
                      <span>
                        ✓ {steps.length} missions
                      </span>

                      <span>
                        ⏱ {minutes} min
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="history-delete"
                    onClick={() => onRemove(item.id)}
                    aria-label={`Delete ${
                      item.goal || "quest"
                    }`}
                  >
                    ×
                  </button>
                </article>
              );
            })
          )}
        </div>
      </aside>
    </div>
  );
}
