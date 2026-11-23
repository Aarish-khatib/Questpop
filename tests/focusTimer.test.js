import test from "node:test";
import assert from "node:assert/strict";
import { FOCUS_SECONDS, remainingSeconds, formatCountdown } from "../src/utils/focusTimer.js";

test("two minute duration and formatting", () => {
  assert.equal(FOCUS_SECONDS, 120);
  assert.equal(formatCountdown(120), "02:00");
  assert.equal(formatCountdown(9), "00:09");
});
test("countdown uses absolute time and never becomes negative", () => {
  assert.equal(remainingSeconds(120000, 0), 120);
  assert.equal(remainingSeconds(120000, 119001), 1);
  assert.equal(remainingSeconds(120000, 120000), 0);
  assert.equal(remainingSeconds(120000, 130000), 0);
});
test("invalid inputs are safe", () => {
  assert.equal(remainingSeconds(NaN, 0), 0);
  assert.equal(formatCountdown(Infinity), "00:00");
});
