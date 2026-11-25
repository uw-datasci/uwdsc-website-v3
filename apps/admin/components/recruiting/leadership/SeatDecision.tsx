"use client";

import { SLOT_DECISION_LABELS, type SlotDecision } from "@uwdsc/common/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, cn } from "@uwdsc/ui";
import { SegmentedControl } from "./SegmentedControl";

type DecisionOption = { value: SlotDecision; label: string };

interface SeatDecisionProps {
  readonly label: string;
  readonly value: SlotDecision;
  readonly options: ReadonlyArray<DecisionOption>;
  readonly onChange: (value: SlotDecision) => void;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly segmentedClassName?: string;
}

/**
 * What happens to a leadership seat next term: segmented buttons from `sm` up, a dropdown
 * on phones (the buttons don't fit a narrow card).
 */
export function SeatDecision({
  label,
  value,
  options,
  onChange,
  disabled,
  className,
  segmentedClassName,
}: SeatDecisionProps) {
  return (
    <>
      <DecisionSelect
        label={label}
        value={value}
        options={options}
        onChange={onChange}
        disabled={disabled}
        className={cn("sm:hidden", className)}
      />
      <SegmentedControl
        label={label}
        value={value}
        options={options}
        onChange={onChange}
        disabled={disabled}
        className={cn("hidden sm:flex", className, segmentedClassName)}
      />
    </>
  );
}

/** Dropdown version. Undecided is highlighted until it's set. */
function DecisionSelect({
  label,
  value,
  options,
  onChange,
  disabled,
  className,
}: Omit<SeatDecisionProps, "segmentedClassName">) {
  // A select can only show a value that's in its list (e.g. a president still Undecided).
  const items = options.some((option) => option.value === value)
    ? options
    : [...options, { value, label: SLOT_DECISION_LABELS[value] }];

  return (
    <Select
      value={value}
      disabled={disabled}
      onValueChange={(next) => onChange(next as SlotDecision)}
    >
      <SelectTrigger
        aria-label={label}
        className={cn(
          "w-full min-w-0",
          value === "undecided" &&
            "border-amber-500/50 bg-amber-500/10 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300",
          className
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {items.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
