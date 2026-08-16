export default function Navbar({
  hasQuest,

  historyCount,

  onNewQuest,

  onHistory,
}) {
  return (
    <header className="navbar">
      <div className="logo">
        QUESTPOP!
      </div>

      <div className="nav-right">
        <span className="nav-pill">
          ⚡ ZERO OVERTHINKING
        </span>

        <button
          className="history-button"
          type="button"
          onClick={onHistory}
        >
          🕘 HISTORY

          {historyCount > 0 && (
            <span className="history-count">
              {historyCount}
            </span>
          )}
        </button>

        {hasQuest && (
          <button
            className="mini-button"
            type="button"
            onClick={
              onNewQuest
            }
          >
            + NEW QUEST
          </button>
        )}
      </div>
    </header>
  );
}