"use client";

import { type HTMLAttributes, type ReactNode } from "react";
import clsx from "clsx";

type CardPadding = "none" | "sm" | "md" | "lg";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: CardPadding;
  hoverable?: boolean;
}

const paddingClasses: Record<CardPadding, string> = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  children,
  padding = "md",
  hoverable = false,
  onClick,
  className,
  ...props
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "bg-white rounded-2xl border border-gray-200 shadow-card",
        paddingClasses[padding],
        hoverable && "transition-shadow duration-200 hover:shadow-card-hover",
        onClick && "cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
