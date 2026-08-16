import {
  useEffect,
} from "react";

export default function Toast({
  message,

  onDone,
}) {
  useEffect(() => {
    if (!message) {
      return undefined;
    }

    const timeout =
      window.setTimeout(
        onDone,
        1800
      );

    return () =>
      window.clearTimeout(
        timeout
      );
  }, [
    message,
    onDone,
  ]);

  if (!message) {
    return null;
  }

  return (
    <div
      className="quest-toast"
      role="status"
    >
      <span>💥</span>

      {message}
    </div>
  );
}