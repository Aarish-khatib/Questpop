export default function ComicBurst({
  text = "POW!",
  className = "",
}) {
  return (
    <div
      className={`comic-burst ${className}`}
      aria-hidden="true"
    >
      {text}
    </div>
  );
}