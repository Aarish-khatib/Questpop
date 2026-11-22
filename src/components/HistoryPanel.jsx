import { useEffect, useRef, useState } from "react";
import {
  createHistoryBackup,
  parseHistoryBackup,
  MAX_BACKUP_BYTES,
} from "../utils/historyBackup.js";
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
  onRestore,
}) {
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);
  const fileInputRef = useRef(null);
  const [backupMessage, setBackupMessage] = useState("");

  useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused = document.activeElement;
    closeButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
    };
  }, [open, onClose]);

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

  function handleExport() {
    try {
      const backup = createHistoryBackup(safeHistory);
      const blob = new Blob([backup], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `questpop-history-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 2000);
      setBackupMessage("History backup prepared. Keep your JSON file somewhere safe.");
    } catch (error) {
      setBackupMessage(error instanceof Error ? error.message : "Could not export history.");
    }
  }

  async function handleImportFile(event) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;

    if (file.size > MAX_BACKUP_BYTES) {
      setBackupMessage("Backup is too large. Choose a QuestPop JSON file under 1 MB.");
      return;
    }

    try {
      const restored = parseHistoryBackup(await file.text());
      const confirmed = window.confirm(
        `Restore ${restored.length} completed quest(s) from this backup? This replaces your current ${safeHistory.length} saved quest(s). Your active quest is not changed.`
      );
      if (!confirmed) return;
      onRestore(restored);
      setBackupMessage(`Restored ${restored.length} completed quest(s).`);
    } catch (error) {
      setBackupMessage(error instanceof Error ? error.message : "Could not read this backup.");
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
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quest-history-title"
      >
        <div className="history-header">
          <div>
            <span className="history-kicker">
              ⚡ YOUR RUN
            </span>

            <h2 id="quest-history-title">
              QUEST <span>HISTORY</span>
            </h2>
          </div>

          <button
            type="button"
            className="history-close"
            ref={closeButtonRef}
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

        <section className="history-backup" aria-label="History backup tools">
          <strong>YOUR QUESTS, YOUR DATA</strong>
          <p>
            Export your completed quests to a local JSON file, or restore
            an earlier QuestPop backup. No account or cloud upload required.
          </p>
          <div className="history-backup-actions">
            <button
              type="button"
              disabled={safeHistory.length === 0}
              onClick={handleExport}
            >
              EXPORT BACKUP
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              RESTORE BACKUP
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              aria-label="Choose QuestPop history backup"
              onChange={handleImportFile}
              hidden
            />
          </div>
          {backupMessage && (
            <p className="history-backup-status" role="status">
              {backupMessage}
            </p>
          )}
        </section>

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
