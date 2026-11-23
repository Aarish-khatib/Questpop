export const FOCUS_SECONDS = 120;

export function remainingSeconds(deadline, now = Date.now()) {
  if (!Number.isFinite(deadline) || !Number.isFinite(now)) return 0;
  return Math.max(0, Math.ceil((deadline - now) / 1000));
}

export function formatCountdown(seconds) {
  const safe = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
}
