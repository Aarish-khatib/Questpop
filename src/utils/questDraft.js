export const DRAFT_KEY = "questpop:goal-draft:v1";
export const MAX_GOAL_LENGTH = 140;
export const VALID_ENERGIES = ["low", "normal", "high"];

export function parseQuestDraft(raw) {
  if (typeof raw !== "string") return null;
  try {
    const draft = JSON.parse(raw);
    if (!draft || typeof draft !== "object" || Array.isArray(draft)) return null;
    if (typeof draft.goal !== "string" || draft.goal.length > MAX_GOAL_LENGTH) return null;
    if (!VALID_ENERGIES.includes(draft.energy)) return null;
    return { goal: draft.goal, energy: draft.energy };
  } catch {
    return null;
  }
}

export function loadQuestDraft(storage) {
  try {
    return parseQuestDraft(storage?.getItem(DRAFT_KEY));
  } catch {
    return null;
  }
}

export function saveQuestDraft(storage, goal, energy) {
  try {
    if (!goal.trim()) {
      storage?.removeItem(DRAFT_KEY);
      return true;
    }
    if (goal.length > MAX_GOAL_LENGTH || !VALID_ENERGIES.includes(energy)) return false;
    storage?.setItem(DRAFT_KEY, JSON.stringify({ goal, energy }));
    return true;
  } catch {
    return false;
  }
}

export function clearQuestDraft(storage) {
  try {
    storage?.removeItem(DRAFT_KEY);
  } catch {
    // Private browsing or disabled storage must never block starting a quest.
  }
}
