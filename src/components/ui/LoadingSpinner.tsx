"use client";

import clsx from "clsx";

type SpinnerSize = "sm" | "md" | "lg";

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  color?: string;
  className?: string;
}

const sizeMap: Record<SpinnerSize, number> = {
  sm: 16,
  md: 24,
  lg: 40,
};

export function LoadingSpinner({
  size = "md",
  color = "#0A84FF",
  className,
}: LoadingSpinnerProps) {
  const px = sizeMap[size];

  return (
    <div
      className={clsx("animate-spin rounded-full shrink-0", className)}
      style={{
        width: px,
        height: px,
        border: `${px >= 40 ? 3 : 2}px solid ${color}20`,
        borderTopColor: color,
      }}
      role="status"
      aria-label="Loading"
    />
  );
}
