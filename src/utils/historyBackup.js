/**
 * Portable, local-only backup format for completed QuestPop history.
 *
 * Parsing is deliberately strict. A malformed backup must never replace
 * a user's existing browser history.
 */
export const BACKUP_FORMAT = "questpop-history";
export const BACKUP_VERSION = 1;
export const MAX_BACKUP_BYTES = 1_000_000;
export const MAX_HISTORY_ENTRIES = 50;

const ALLOWED_ENERGY = new Set(["low", "normal", "high"]);

function object(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function text(value, field, maxLength) {
  if (
    typeof value !== "string" ||
    !value.trim() ||
    value.length > maxLength
  ) {
    throw new Error(`Invalid ${field}: expected non-empty text of at most ${maxLength} characters.`);
  }
  return value;
}

function timestamp(value, field, optional = false) {
  if (value === null && optional) return null;
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`Invalid ${field}: expected a non-negative timestamp.`);
  }
  return value;
}

export function validateHistory(history) {
  if (!Array.isArray(history) || history.length > MAX_HISTORY_ENTRIES) {
    throw new Error(`Backup must contain at most ${MAX_HISTORY_ENTRIES} quests.`);
  }

  const ids = new Set();
  return history.map((item, index) => {
    if (!object(item)) throw new Error(`Quest ${index + 1} is invalid.`);

    const id = text(item.id, "quest ID", 128);
    if (ids.has(id)) throw new Error("Backup contains duplicate quest IDs.");
    ids.add(id);

    const goal = text(item.goal, "goal", 140);
    if (!ALLOWED_ENERGY.has(item.energy)) {
      throw new Error("Backup contains an unsupported energy setting.");
    }
    if (!Array.isArray(item.steps) || item.steps.length < 1 || item.steps.length > 20) {
      throw new Error("A quest has an invalid number of steps.");
    }
    if (item.completed !== true) {
      throw new Error("Backups can only contain completed quests.");
    }

    const steps = item.steps.map((step) => {
      if (!object(step)) throw new Error("Backup contains an invalid step.");
      if (!Number.isInteger(step.minutes) || step.minutes < 1 || step.minutes > 1440) {
        throw new Error("Backup contains an invalid step duration.");
      }
      return {
        id: text(step.id, "step ID", 128),
        title: text(step.title, "step title", 200),
        detail: text(step.detail, "step detail", 2000),
        minutes: step.minutes,
      };
    });

    return {
      id,
      goal,
      energy: item.energy,
      steps,
      currentIndex: steps.length,
      completed: true,
      startedAt: timestamp(item.startedAt, "start time", true),
      completedAt: timestamp(item.completedAt, "completion time"),
    };
  });
}

export function createHistoryBackup(history, exportedAt = new Date().toISOString()) {
  if (typeof exportedAt !== "string" || !Number.isFinite(Date.parse(exportedAt))) {
    throw new Error("Invalid export date.");
  }
  const payload = {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt,
    history: validateHistory(history),
  };
  const json = JSON.stringify(payload, null, 2) + "\n";
  if (new TextEncoder().encode(json).length > MAX_BACKUP_BYTES) {
    throw new Error("History is too large to export as one backup.");
  }
  return json;
}

export function parseHistoryBackup(source) {
  if (typeof source !== "string" || new TextEncoder().encode(source).length > MAX_BACKUP_BYTES) {
    throw new Error("Backup must be a JSON file smaller than 1 MB.");
  }

  let payload;
  try {
    payload = JSON.parse(source);
  } catch {
    throw new Error("This file is not valid JSON.");
  }

  if (!object(payload) || payload.format !== BACKUP_FORMAT || payload.version !== BACKUP_VERSION) {
    throw new Error("This is not a supported QuestPop history backup.");
  }

  if (typeof payload.exportedAt !== "string" || !Number.isFinite(Date.parse(payload.exportedAt))) {
    throw new Error("Backup has an invalid export date.");
  }

  return validateHistory(payload.history);
}
