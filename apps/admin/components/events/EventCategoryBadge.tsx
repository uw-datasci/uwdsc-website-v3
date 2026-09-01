import { Badge } from "@uwdsc/ui";
import type { EventCategory } from "@uwdsc/common/types";

const CATEGORY_STYLES: Record<EventCategory, { label: string; className: string }> = {
  workshop: {
    label: "Workshop",
    className:
      "bg-violet-500/15 text-violet-700 border border-violet-500/30 dark:text-violet-300 dark:bg-violet-500/15 dark:border-violet-500/30",
  },
  social: {
    label: "Social",
    className:
      "bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 dark:text-emerald-300 dark:bg-emerald-500/15 dark:border-emerald-500/30",
  },
  academic: {
    label: "Academic",
    className:
      "bg-sky-500/15 text-sky-700 border border-sky-500/30 dark:text-sky-300 dark:bg-sky-500/15 dark:border-sky-500/30",
  },
};

/**
 * Small pill showing an event's category. Every event has one (the column is NOT NULL, with
 * every pre-existing row backfilled to "social") -- this is also how an exec spots the
 * backfilled rows that still need re-tagging as workshop/academic.
 */
export function EventCategoryBadge({ category }: Readonly<{ category: EventCategory }>) {
  const { label, className } = CATEGORY_STYLES[category];
  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
}
