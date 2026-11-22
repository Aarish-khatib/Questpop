import test from "node:test";
import assert from "node:assert/strict";

import { normalizeSavedQuest } from "../src/utils/normalizeSavedQuest.js";

const validSteps = [
  { id: "a", title: "Start", detail: "Do something", minutes: 5 },
  { id: "b", title: "Finish", detail: "Wrap up", minutes: 3 },
];

test("recovers from null, arrays, primitives and malformed steps", () => {
  for (const input of [null, 5, "oops", [], { steps: {} }, { steps: null }]) {
    const quest = normalizeSavedQuest(input);
    assert.deepEqual(quest.steps, []);
    assert.equal(quest.completed, false);
    assert.equal(quest.currentIndex, 0);
  }
});

test("preserves valid active quest progress", () => {
  const quest = normalizeSavedQuest({
    id: "q", goal: "Write tests", energy: "normal",
    steps: validSteps, currentIndex: 1, completed: false,
  });
  assert.equal(quest.id, "q");
  assert.equal(quest.currentIndex, 1);
  assert.equal(quest.completed, false);
  assert.deepEqual(quest.steps, validSteps);
});

test("clamps out-of-range indices and recognizes finished quests", () => {
  assert.equal(normalizeSavedQuest({ steps: validSteps, currentIndex: -3 }).currentIndex, 0);
  const finished = normalizeSavedQuest({ steps: validSteps, currentIndex: 999 });
  assert.equal(finished.currentIndex, 2);
  assert.equal(finished.completed, true);
  const markedFinished = normalizeSavedQuest({ steps: validSteps, currentIndex: 0, completed: true });
  assert.equal(markedFinished.currentIndex, 2);
});

test("discards invalid steps and sanitizes fields", () => {
  const quest = normalizeSavedQuest({
    goal: { malformed: true }, energy: "unknown", currentIndex: NaN,
    steps: [null, 3, {}, { id: "x", title: "bad", detail: "no time", minutes: -2 }, validSteps[0]],
  });
  assert.equal(quest.goal, "");
  assert.equal(quest.energy, "normal");
  assert.equal(quest.currentIndex, 0);
  assert.deepEqual(quest.steps, [validSteps[0]]);
});

test("does not treat an empty completed quest as a finished mission", () => {
  const quest = normalizeSavedQuest({ completed: true, currentIndex: 4, steps: [] });
  assert.equal(quest.completed, false);
  assert.equal(quest.currentIndex, 0);
});
