import test from "node:test";
import assert from "node:assert/strict";
import { secondsUntil } from "../src/utils/timerClock.js";

test("counts down from an absolute deadline", () => {
  assert.equal(secondsUntil(10_000, 0), 10);
  assert.equal(secondsUntil(10_000, 1_000), 9);
  assert.equal(secondsUntil(10_000, 1_001), 9);
  assert.equal(secondsUntil(10_000, 9_999), 1);
});

test("does not report negative or invalid time", () => {
  assert.equal(secondsUntil(5_000, 5_000), 0);
  assert.equal(secondsUntil(5_000, 7_000), 0);
  assert.equal(secondsUntil(null, 1_000), 0);
  assert.equal(secondsUntil(NaN, 1_000), 0);
});

test("advances correctly after a background-tab time jump", () => {
  const deadline = 60_000;
  assert.equal(secondsUntil(deadline, 0), 60);
  assert.equal(secondsUntil(deadline, 40_500), 20);
  assert.equal(secondsUntil(deadline, 90_000), 0);
});
