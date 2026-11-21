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

test("supports every template category and falls back for unmatched goals", () => {
  const examples = [
    ["Clean my desk", "clean-1"],
    ["Read a book", "read-1"],
    ["Plan my schedule", "plan-1"],
    ["Study science", "study-1"],
    ["Code a website", "code-1"],
    ["Write an essay", "write-1"],
    ["Go for a walk", "general-1"],
  ];

  for (const [goal, expectedFirstId] of examples) {
    const steps = createQuestPlan(goal);
    assert.equal(steps.length, 3, goal);
    assert.equal(steps[0].id, expectedFirstId, goal);
    assert.equal(new Set(steps.map((step) => step.id)).size, steps.length, goal);
    assert.ok(steps.every((step) => step.minutes >= 2), goal);
  }
});

test("matches category keywords case-insensitively and at punctuation boundaries", () => {
  assert.equal(createQuestPlan("Please CODE, now!")[0].id, "code-1");
  assert.equal(createQuestPlan("Read: a novel")[0].id, "read-1");
  assert.equal(createQuestPlan("I love application design")[0].id, "general-1");
});

test("unknown energy uses normal duration estimates", () => {
  const normal = createQuestPlan("Write an essay", "normal");
  const unknown = createQuestPlan("Write an essay", "not-an-energy");
  assert.deepEqual(unknown, normal);
});

test("low-energy estimates stay above the minimum and high energy takes longer", () => {
  const low = createQuestPlan("Clean my room", "low");
  const normal = createQuestPlan("Clean my room", "normal");
  const high = createQuestPlan("Clean my room", "high");
  for (let index = 0; index < low.length; index += 1) {
    assert.ok(low[index].minutes >= 2);
    assert.ok(low[index].minutes <= normal[index].minutes);
    assert.ok(high[index].minutes >= normal[index].minutes);
  }
});
