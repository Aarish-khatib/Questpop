import { energyLevels } from "../data/questTemplates.js";

const EMPTY_QUEST = Object.freeze({
  id: null,
  goal: "",
  energy: "normal",
  steps: [],
  currentIndex: 0,
  completed: false,
  startedAt: null,
  completedAt: null,
});

// Local storage is untrusted input: JSON parsing alone is not validation.
export function normalizeSavedQuest(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ...EMPTY_QUEST, steps: [] };
  }

  const steps = Array.isArray(value.steps)
    ? value.steps.filter(
        (step) =>
          step &&
          typeof step === "object" &&
          !Array.isArray(step) &&
          typeof step.id === "string" &&
          typeof step.title === "string" &&
          typeof step.detail === "string" &&
          Number.isFinite(step.minutes) &&
          step.minutes > 0
      )
    : [];

  const index = Number.isSafeInteger(value.currentIndex)
    ? Math.max(0, Math.min(value.currentIndex, steps.length))
    : 0;

  const completed = steps.length > 0 &&
    (value.completed === true || index === steps.length);

  return {
    id: typeof value.id === "string" ? value.id : null,
    goal: typeof value.goal === "string" ? value.goal : "",
    energy: Object.hasOwn(energyLevels, value.energy) ? value.energy : "normal",
    steps,
    currentIndex: completed ? steps.length : index,
    completed,
    startedAt: Number.isFinite(value.startedAt) ? value.startedAt : null,
    completedAt: completed && Number.isFinite(value.completedAt) ? value.completedAt : null,
  };
}
