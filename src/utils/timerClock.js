/**
 * Return whole displayed seconds remaining until an absolute deadline.
 * Using wall-clock time keeps the countdown accurate when a tab is throttled.
 */
export function secondsUntil(deadlineMs, nowMs = Date.now()) {
  if (!Number.isFinite(deadlineMs) || !Number.isFinite(nowMs)) {
    return 0;
  }
  return Math.max(0, Math.ceil((deadlineMs - nowMs) / 1000));
}
