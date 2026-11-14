import { STATUS_LABELS, type SelectionStatus } from "@uwdsc/common/recruiting";
import { cn } from "@uwdsc/ui";
import { STATUS_TONES } from "@/constants/recruiting";

export function StatusDot({
  status,
  className,
}: {
  readonly status: SelectionStatus;
  readonly className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn("size-2 flex-none rounded-full", STATUS_TONES[status].dot, className)}
    />
  );
}

export function StatusBadge({
  status,
  className,
}: {
  readonly status: SelectionStatus;
  readonly className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-1.5 py-0.5 text-[11px] leading-4 font-medium",
        STATUS_TONES[status].badge,
        className
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
