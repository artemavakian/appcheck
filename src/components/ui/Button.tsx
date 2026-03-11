"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import clsx from "clsx";
import { LoadingSpinner } from "./LoadingSpinner";

type ButtonVariant = "primary" | "secondary" | "ghost" | "apple";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: ReactNode;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm rounded-lg",
  md: "px-6 py-3 text-base rounded-xl",
  lg: "px-8 py-4 text-lg rounded-xl",
};

const AppleLogo = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="currentColor"
    className="shrink-0"
  >
    <path d="M14.94 13.38c-.34.78-.5 1.13-.94 1.82-.6.97-1.46 2.17-2.52 2.18-1.05.02-1.32-.68-2.74-.67-1.42.01-1.72.69-2.77.67-1.06-.01-1.87-1.1-2.48-2.07C2.1 13.16 1.95 10.63 3.03 9.3c.77-.95 1.98-1.5 3.12-1.5 1.16 0 1.89.69 2.85.69.93 0 1.5-.69 2.84-.69 1.01 0 2.09.55 2.86 1.5-2.52 1.38-2.11 4.97.24 6.08ZM11.5 5.99c.47-.6.82-1.45.69-2.32-.76.05-1.65.51-2.17 1.12-.47.55-.86 1.41-.71 2.24.83.03 1.69-.44 2.19-1.04Z" />
  </svg>
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", size = "md", loading = false, className, disabled, children, ...props },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={clsx(
          "relative inline-flex items-center justify-center gap-2 font-medium transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-apple-blue/40 focus-visible:ring-offset-2",
          sizeClasses[size],
          variant === "primary" && [
            "text-white shadow-md",
            "bg-gradient-to-br from-apple-blue to-apple-cyan",
            "hover:shadow-lg hover:brightness-110 active:scale-[0.98]",
          ],
          variant === "secondary" && [
            "bg-gray-100 text-gray-900 border border-gray-200",
            "hover:bg-gray-200 active:scale-[0.98]",
          ],
          variant === "ghost" && [
            "text-gray-600",
            "hover:bg-gray-100 active:scale-[0.98]",
          ],
          variant === "apple" && [
            "bg-black text-white",
            "hover:bg-gray-800 active:scale-[0.98]",
          ],
          isDisabled && "opacity-50 pointer-events-none",
          className
        )}
        {...props}
      >
        {loading && (
          <LoadingSpinner
            size="sm"
            color={variant === "secondary" || variant === "ghost" ? "#1C1C1E" : "#FFFFFF"}
          />
        )}
        {variant === "apple" && !loading && <AppleLogo />}
        <span className={clsx(loading && "opacity-70")}>{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";
