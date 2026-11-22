import assert from "node:assert/strict";
import test from "node:test";
import { createQuestPlan } from "../src/utils/questGenerator.js";

test("rejects malformed or empty quest goals without throwing", () => {
  for (const goal of [null, undefined, 42, {}, [], true, "", "  \t  "]) {
    assert.deepEqual(createQuestPlan(goal), [], String(goal));
  }
});

test("preserves normal quest generation for a valid goal", () => {
  const steps = createQuestPlan("  Study   chapter  2  ", "normal");
  assert.ok(steps.length > 0);
  assert.ok(steps.every((step) => typeof step.title === "string" && step.title.length > 0));
  assert.ok(steps.some((step) => step.detail.includes("Study chapter 2")));
});
