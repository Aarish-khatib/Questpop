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

  const rawSteps = Array.isArray(value.steps) ? value.steps : [];
  const isValidStep = (step) =>
    step &&
    typeof step === "object" &&
    !Array.isArray(step) &&
    typeof step.id === "string" &&
    typeof step.title === "string" &&
    typeof step.detail === "string" &&
    Number.isFinite(step.minutes) &&
    step.minutes > 0;

  const steps = rawSteps.filter(isValidStep);

  // A saved cursor refers to the original array. If corrupt entries are
  // discarded before it, shift the cursor too so the next step isn't skipped.
  const rawIndex = Number.isSafeInteger(value.currentIndex)
    ? Math.max(0, Math.min(value.currentIndex, rawSteps.length))
    : 0;
  const index = rawSteps.slice(0, rawIndex).filter(isValidStep).length;

  const completed = steps.length > 0 &&
    (value.completed === true ||
      (rawSteps.length > 0 && rawIndex === rawSteps.length));

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
