import test from "node:test";
import assert from "node:assert/strict";

import { createQuestPlan } from "../src/utils/questGenerator.js";

test("returns no steps for whitespace-only goals", () => {
  assert.deepEqual(createQuestPlan(" \n  "), []);
});

test("avoids classifying fragments inside unrelated words", () => {
  assert.equal(createQuestPlan("Be happy today")[0].id, "general-1");
  assert.equal(createQuestPlan("Review a spreadsheet")[0].id, "general-1");
});

test("recognizes explicit goal categories", () => {
  assert.equal(createQuestPlan("Build an app")[0].id, "code-1");
  assert.equal(createQuestPlan("Write a report")[0].id, "write-1");
  assert.equal(createQuestPlan("Study for my exam")[0].id, "study-1");
  assert.equal(createQuestPlan("Read a novel")[0].id, "read-1");
});

test("normalizes whitespace and scales step estimates by energy", () => {
  const normal = createQuestPlan("  Build   an app  ", "normal");
  const low = createQuestPlan("Build an app", "low");
  const high = createQuestPlan("Build an app", "high");
  assert.equal(normal.length, 3);
  assert.match(normal[0].detail, /Build an app/);
  assert.ok(low[0].minutes < normal[0].minutes);
  assert.ok(high[0].minutes > normal[0].minutes);
});
