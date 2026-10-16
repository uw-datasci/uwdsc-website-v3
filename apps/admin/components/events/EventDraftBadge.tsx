import { Badge } from "@uwdsc/ui";

/**
 * Marks an unpublished event (e.g. one created from Discord via /event-create). Drafts are
 * hidden from the website, calendar feed, and check-in until someone publishes them.
 */
export function EventDraftBadge() {
  return (
    <Badge
      variant="outline"
      className="bg-amber-500/15 text-amber-700 border border-amber-500/30 dark:text-amber-300 dark:bg-amber-500/15 dark:border-amber-500/30"
    >
      Draft
    </Badge>
  );
}
