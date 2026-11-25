import Link from "next/link";
import { Check, PlayCircle } from "lucide-react";
import type { ChecklistItem } from "@uwdsc/common/types";
import { cn } from "@uwdsc/ui";

/** The viewer's to-dos for this cycle, ticked off from state. */
export function ChecklistCard({
  items,
  onStartTour,
}: {
  readonly items: readonly ChecklistItem[];
  readonly onStartTour: () => void;
}) {
  const done = items.filter((item) => item.done).length;

  return (
    <section aria-labelledby="checklist-h" className="flex flex-col rounded-lg border">
      <div className="flex items-baseline gap-2 border-b px-4 py-3">
        <h2 id="checklist-h" className="text-sm font-semibold">
          Your checklist
        </h2>
        <span className="text-xs text-muted-foreground tabular-nums">
          {done} of {items.length} done
        </span>
      </div>
      <ul className="py-1">
        {items.map((item) => {
          const row = (
            <>
              <span
                aria-hidden
                className={cn(
                  "flex size-4.5 flex-none items-center justify-center rounded-full",
                  item.done
                    ? "bg-primary text-primary-foreground"
                    : "ring-1 ring-border ring-inset"
                )}
              >
                {item.done && <Check className="size-3" />}
              </span>
              <span
                className={cn(
                  "flex-1 text-[13px]",
                  item.done && "text-muted-foreground line-through"
                )}
              >
                {item.label}
                <span className="sr-only">{item.done ? " (done)" : " (to do)"}</span>
              </span>
            </>
          );
          const rowClass =
            "flex w-full items-center gap-2.5 px-4 py-2 text-left hover:bg-muted/50";

          return (
            <li key={item.id}>
              {item.id === "tour" && !item.done ? (
                <button type="button" className={rowClass} onClick={onStartTour}>
                  {row}
                  <PlayCircle className="size-3.5 text-primary" aria-hidden />
                </button>
              ) : (
                <Link href={item.href} className={rowClass}>
                  {row}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
