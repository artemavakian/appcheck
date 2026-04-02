"use client";

import clsx from "clsx";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  maxVisitedStep?: number;
  onStepClick?: (step: number) => void;
  className?: string;
}

export function StepIndicator({
  currentStep,
  totalSteps,
  maxVisitedStep,
  onStepClick,
  className,
}: StepIndicatorProps) {
  const maxReachable = maxVisitedStep ?? currentStep;

  return (
    <div className={clsx("w-full", className)}>
      {/* Mobile: compact text */}
      <div className="flex items-center justify-center sm:hidden">
        <span className="text-sm font-medium text-gray-500">
          Step{" "}
          <span className="text-gray-900">{currentStep}</span>{" "}
          of {totalSteps}
        </span>
      </div>

      {/* Desktop: circles + connectors */}
      <div className="hidden sm:flex items-center justify-center">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1;
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;
          const isClickable = step <= maxReachable && step !== currentStep;

          return (
            <div key={step} className="flex items-center">
              {/* Circle */}
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick?.(step)}
                className={clsx(
                  "w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 shrink-0",
                  isCurrent &&
                    "text-white shadow-md bg-gradient-to-br from-apple-blue to-apple-cyan",
                  isCompleted && "bg-apple-blue text-white",
                  !isCurrent &&
                    !isCompleted &&
                    "border-2 border-gray-300 text-gray-400",
                  isClickable && "cursor-pointer hover:scale-110",
                  !isClickable && !isCurrent && !isCompleted && "cursor-default"
                )}
              >
                {isCompleted ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3.5 8.5 6.5 11.5 12.5 5" />
                  </svg>
                ) : (
                  step
                )}
              </button>

              {/* Connector line */}
              {step < totalSteps && (
                <div
                  className={clsx(
                    "w-12 h-0.5 mx-1 transition-colors duration-300",
                    step < currentStep ? "bg-apple-blue" : "bg-gray-200"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
