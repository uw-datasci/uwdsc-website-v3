import { Check } from "lucide-react";
import type { OverviewStep } from "@uwdsc/common/types";
import { cn } from "@uwdsc/ui";

const CIRCLE: Record<OverviewStep["state"], string> = {
  done: "bg-primary text-primary-foreground",
  current: "bg-primary/10 text-primary ring-2 ring-primary ring-inset",
  partial: "bg-card text-primary outline-2 outline-dashed outline-primary -outline-offset-2",
  next: "bg-card text-muted-foreground ring-1 ring-border ring-inset",
};

const STATE_LABEL: Record<OverviewStep["state"], string> = {
  done: "done",
  current: "in progress",
  partial: "started",
  next: "not started",
};

/** Six cycle steps with done / current / started / upcoming states. */
export function PhaseStepper({
  steps,
  stepNumber,
  stepLabel,
  summary,
}: {
  readonly steps: readonly OverviewStep[];
  readonly stepNumber: number;
  readonly stepLabel: string;
  readonly summary: string;
}) {
  return (
    <section
      data-tour="stepper"
      aria-labelledby="stepper-h"
      className="flex flex-col gap-4 rounded-lg border px-5 py-4"
    >
      <div>
        <h2 id="stepper-h" className="text-sm font-semibold">
          Step {stepNumber} of {steps.length} · {stepLabel}
        </h2>
        <p className="text-[13px] text-muted-foreground">{summary}</p>
      </div>
      <ol className="grid grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-3 lg:grid-cols-6">
        {steps.map((step, index) => (
          <li
            key={step.key}
            aria-current={step.state === "current" ? "step" : undefined}
            className="flex min-w-0 flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex size-7 flex-none items-center justify-center rounded-full text-xs font-semibold",
                  CIRCLE[step.state]
                )}
              >
                {step.state === "done" ? <Check className="size-3.5" aria-hidden /> : index + 1}
                <span className="sr-only">, {STATE_LABEL[step.state]}</span>
              </span>
              {index < steps.length - 1 && (
                <span
                  aria-hidden
                  className={cn(
                    "hidden h-0.5 flex-1 rounded-full lg:block",
                    step.state === "done" ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </div>
            <div className="min-w-0">
              <div
                className={cn(
                  "truncate text-[13px] font-medium",
                  step.state === "next" && "text-muted-foreground"
                )}
              >
                {step.label}
              </div>
              <div className="truncate text-xs text-muted-foreground">{step.sub}</div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
