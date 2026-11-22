import useLocalStorage from "./useLocalStorage.js";
import useHistory from "./useHistory.js";
import { createQuestPlan } from "../utils/questGenerator.js";
import { normalizeSavedQuest } from "../utils/normalizeSavedQuest.js";

const EMPTY_QUEST = {
  id: null,
  goal: "",
  energy: "normal",
  steps: [],
  currentIndex: 0,
  completed: false,
  startedAt: null,
  completedAt: null,
};

function createQuestId() {
  if (
    typeof crypto !== "undefined" &&
    crypto.randomUUID
  ) {
    return crypto.randomUUID();
  }

  return `quest-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

export default function useQuest() {
  const [storedQuest, setQuest] = useLocalStorage(
    "questpop-active-quest",
    EMPTY_QUEST
  );

  const {
    history,
    stats,
    addQuest,
    removeQuest,
    clearHistory,
    restoreHistory,
  } = useHistory();

  const quest = normalizeSavedQuest(storedQuest);

  function startQuest(goal, energy = "normal") {
    const cleanGoal = goal.trim();

    if (!cleanGoal) {
      return false;
    }

    const steps = createQuestPlan(
      cleanGoal,
      energy
    );

    if (!steps.length) {
      return false;
    }

    setQuest({
      id: createQuestId(),
      goal: cleanGoal,
      energy,
      steps,
      currentIndex: 0,
      completed: false,
      startedAt: Date.now(),
      completedAt: null,
    });

    return true;
  }

  function completeCurrentStep() {
    if (
      !quest.steps.length ||
      quest.completed
    ) {
      return "nothing";
    }

    const isLastStep =
      quest.currentIndex >=
      quest.steps.length - 1;

    if (isLastStep) {
      const finishedQuest = {
        ...quest,
        currentIndex: quest.steps.length,
        completed: true,
        completedAt: Date.now(),
      };

      setQuest(finishedQuest);
      addQuest(finishedQuest);

      return "completed";
    }

    setQuest({
      ...quest,
      currentIndex: quest.currentIndex + 1,
    });

    return "advanced";
  }

  function resetQuest() {
    setQuest(EMPTY_QUEST);
  }

  const activeStep =
    quest.steps.length > 0 &&
    !quest.completed
      ? quest.steps[quest.currentIndex]
      : null;

  const completedSteps =
    quest.completed
      ? quest.steps.length
      : quest.currentIndex;

  const progress =
    quest.steps.length > 0
      ? Math.round(
          (completedSteps / quest.steps.length) * 100
        )
      : 0;

  return {
    quest,
    activeStep,
    progress,
    history,
    stats,
    startQuest,
    completeCurrentStep,
    resetQuest,
    removeHistoryQuest: removeQuest,
    clearHistory,
    restoreHistory,
  };
}
