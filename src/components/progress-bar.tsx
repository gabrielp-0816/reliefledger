export function ProgressBar({
  value,
  tone = "trust",
  showLabel = false,
}: {
  value: number;
  tone?: "trust" | "relief" | "alert";
  showLabel?: boolean;
}) {
  const pct = Math.max(0, Math.min(100, value));
  const toneClass =
    tone === "alert"
      ? "bg-[color:var(--alert)]"
      : tone === "relief"
      ? "bg-[color:var(--relief)]"
      : "bg-primary";
  return (
    <div className="w-full">
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={`h-full rounded-full ${toneClass} transition-[width] duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-right text-xs font-medium text-muted-foreground">{pct}% funded</div>
      )}
    </div>
  );
}
