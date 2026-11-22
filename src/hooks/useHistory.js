import useLocalStorage from "./useLocalStorage.js";

export default function useHistory() {
  const [storedHistory, setHistory] = useLocalStorage(
    "questpop-history",
    []
  );

  const history = Array.isArray(storedHistory)
    ? storedHistory
    : [];

  function addQuest(quest) {
    if (!quest?.id) {
      return;
    }

    setHistory((currentHistory) => {
      const safeHistory = Array.isArray(currentHistory)
        ? currentHistory
        : [];

      const withoutDuplicate = safeHistory.filter(
        (item) => item.id !== quest.id
      );

      return [quest, ...withoutDuplicate].slice(0, 50);
    });
  }

  function removeQuest(id) {
    setHistory((currentHistory) => {
      const safeHistory = Array.isArray(currentHistory)
        ? currentHistory
        : [];

      return safeHistory.filter(
        (quest) => quest.id !== id
      );
    });
  }

  function clearHistory() {
    setHistory([]);
  }

  function restoreHistory(completedQuests) {
    // Already validated by parseHistoryBackup before the UI calls this.
    setHistory(completedQuests);
  }

  const todayKey = new Date().toDateString();

  const completedToday = history.filter((quest) => {
    if (!quest.completedAt) {
      return false;
    }

    return (
      new Date(quest.completedAt).toDateString() ===
      todayKey
    );
  }).length;

  const totalMinutes = history.reduce(
    (total, quest) => {
      const questMinutes = Array.isArray(quest.steps)
        ? quest.steps.reduce(
            (sum, step) =>
              sum + (Number(step.minutes) || 0),
            0
          )
        : 0;

      return total + questMinutes;
    },
    0
  );

  const missionsCleared = history.reduce(
    (total, quest) =>
      total +
      (Array.isArray(quest.steps)
        ? quest.steps.length
        : 0),
    0
  );

  return {
    history,

    stats: {
      completed: history.length,
      completedToday,
      totalMinutes,
      missionsCleared,
    },

    addQuest,
    removeQuest,
    clearHistory,
    restoreHistory,
  };
}