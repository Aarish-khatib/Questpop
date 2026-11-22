import test from "node:test";
import assert from "node:assert/strict";

import {
  createHistoryBackup,
  parseHistoryBackup,
  MAX_HISTORY_ENTRIES,
} from "../src/utils/historyBackup.js";

function quest(overrides = {}) {
  return {
    id: "quest-one",
    goal: "Build a website",
    energy: "normal",
    steps: [
      { id: "code-1", title: "Start", detail: "Open the project", minutes: 8 },
      { id: "code-2", title: "Build", detail: "Make a feature", minutes: 12 },
    ],
    currentIndex: 2,
    completed: true,
    startedAt: 1700000000000,
    completedAt: 1700000010000,
    ...overrides,
  };
}

test("round-trips completed history without leaking arbitrary fields", () => {
  const original = [quest({ privateField: "should not be saved" })];
  const json = createHistoryBackup(original, "2026-11-22T00:00:00.000Z");
  const restored = parseHistoryBackup(json);
  assert.equal(restored.length, 1);
  assert.equal(restored[0].goal, "Build a website");
  assert.equal(restored[0].steps.length, 2);
  assert.equal("privateField" in restored[0], false);
  assert.equal(JSON.parse(json).version, 1);
});

test("supports empty history and optional null start time", () => {
  assert.deepEqual(parseHistoryBackup(createHistoryBackup([])), []);
  assert.equal(
    parseHistoryBackup(createHistoryBackup([quest({ startedAt: null })]))[0].startedAt,
    null
  );
});

test("rejects unrelated, malformed, or oversized files", () => {
  assert.throws(() => parseHistoryBackup("{"), /valid JSON/);
  assert.throws(() => parseHistoryBackup(JSON.stringify({ history: [] })), /not a supported/);
  assert.throws(() => parseHistoryBackup(" ".repeat(1_000_001)), /smaller than 1 MB/);
});

test("rejects invalid quest structure before restoring anything", () => {
  for (const bad of [
    quest({ goal: "" }),
    quest({ energy: "unknown" }),
    quest({ completed: false }),
    quest({ steps: [] }),
    quest({ completedAt: "yesterday" }),
    quest({ steps: [{ id: "1", title: "Bad", detail: "No", minutes: -1 }] }),
  ]) {
    assert.throws(() => createHistoryBackup([bad]));
  }
});

test("rejects duplicates and more history than the app stores", () => {
  assert.throws(() => createHistoryBackup([quest(), quest()]), /duplicate/);
  assert.throws(
    () => createHistoryBackup(
      Array.from({ length: MAX_HISTORY_ENTRIES + 1 }, (_, i) => quest({ id: `quest-${i}` }))
    ),
    /at most/
  );
});

test("rejects altered schema and malformed import step data", () => {
  const json = JSON.parse(createHistoryBackup([quest()]));
  json.version = 99;
  assert.throws(() => parseHistoryBackup(JSON.stringify(json)), /not a supported/);
  json.version = 1;
  json.history[0].steps[0].title = "";
  assert.throws(() => parseHistoryBackup(JSON.stringify(json)), /step title/);
});
