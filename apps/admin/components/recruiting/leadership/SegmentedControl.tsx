"use client";

import { Check } from "lucide-react";
import { cn } from "@uwdsc/ui";

interface SegmentedControlProps<T extends string> {
  readonly label: string;
  readonly value: T;
  readonly options: ReadonlyArray<{ value: T; label: string }>;
  readonly onChange: (value: T) => void;
  readonly disabled?: boolean;
  readonly className?: string;
}

/** A row of mutually exclusive options (radio group styled as segments). */
export function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
  disabled,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn("flex gap-0.5 rounded-lg bg-muted p-[3px]", className)}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex h-7 min-w-0 flex-1 items-center justify-center gap-1 rounded-md px-1.5 text-xs font-medium whitespace-nowrap text-muted-foreground transition-colors",
              "hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60",
              selected &&
                "bg-background font-semibold text-foreground shadow-xs ring-1 ring-border"
            )}
          >
            {selected && <Check className="size-3" aria-hidden />}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
