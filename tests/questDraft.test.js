import test from "node:test";
import assert from "node:assert/strict";
import { DRAFT_KEY, parseQuestDraft, loadQuestDraft, saveQuestDraft, clearQuestDraft } from "../src/utils/questDraft.js";

function storage() {
  const map = new Map();
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => map.set(key, value),
    removeItem: (key) => map.delete(key),
  };
}

test("persists and restores a partially typed goal and energy", () => {
  const store = storage();
  assert.equal(saveQuestDraft(store, "Finish prototype", "high"), true);
  assert.deepEqual(loadQuestDraft(store), { goal: "Finish prototype", energy: "high" });
  clearQuestDraft(store);
  assert.equal(store.getItem(DRAFT_KEY), null);
});

test("rejects corrupt, oversized and invalid-energy drafts", () => {
  assert.equal(parseQuestDraft("{bad"), null);
  assert.equal(parseQuestDraft(JSON.stringify({ goal: "x".repeat(141), energy: "low" })), null);
  assert.equal(parseQuestDraft(JSON.stringify({ goal: "ok", energy: "admin" })), null);
  assert.equal(parseQuestDraft(JSON.stringify(["ok"])), null);
});

test("clears whitespace-only drafts", () => {
  const store = storage();
  saveQuestDraft(store, "draft", "normal");
  saveQuestDraft(store, "   ", "normal");
  assert.equal(loadQuestDraft(store), null);
});

test("storage failures do not interrupt quest creation", () => {
  const broken = { getItem() { throw Error("denied"); }, setItem() { throw Error("denied"); }, removeItem() { throw Error("denied"); } };
  assert.equal(loadQuestDraft(broken), null);
  assert.equal(saveQuestDraft(broken, "goal", "low"), false);
  assert.doesNotThrow(() => clearQuestDraft(broken));
});
