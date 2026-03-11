"use client";

import clsx from "clsx";

type ProgressColor = "auto" | "blue" | "green" | "orange" | "red";

interface ProgressBarProps {
  value: number;
  color?: ProgressColor;
  showLabel?: boolean;
  className?: string;
}

function resolveColor(value: number, color: ProgressColor): string {
  if (color !== "auto") {
    const map: Record<Exclude<ProgressColor, "auto">, string> = {
      blue: "linear-gradient(135deg, #0A84FF, #5AC8FA)",
      green: "#34C759",
      orange: "#FF9F0A",
      red: "#FF3B30",
    };
    return map[color];
  }

  if (value > 80) return "#34C759";
  if (value >= 50) return "linear-gradient(135deg, #0A84FF, #5AC8FA)";
  if (value >= 30) return "#FF9F0A";
  return "#FF3B30";
}

export function ProgressBar({
  value,
  color = "auto",
  showLabel = true,
  className,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const fill = resolveColor(clamped, color);
  const isGradient = fill.startsWith("linear");

  return (
    <div className={clsx("w-full", className)}>
      {showLabel && (
        <div className="flex justify-end mb-1.5">
          <span className="text-sm font-medium text-gray-600 tabular-nums">
            {Math.round(clamped)}%
          </span>
        </div>
      )}
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${clamped}%`,
            ...(isGradient
              ? { backgroundImage: fill }
              : { backgroundColor: fill }),
          }}
        />
      </div>
    </div>
  );
}
