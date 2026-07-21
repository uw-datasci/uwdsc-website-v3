"use client";

import { ScrollArea, Badge, cn } from "@uwdsc/ui";
import type { ReturningExecListItem } from "@uwdsc/common/types";
import { reviewStatusBadgeClassName } from "@/lib/utils/applications";

interface ReturningExecListProps {
  readonly submissions: ReturningExecListItem[];
  readonly selectedId: string | null;
  readonly onSelect: (id: string) => void;
}

export function ReturningExecList({
  submissions,
  selectedId,
  onSelect,
}: ReturningExecListProps) {
  if (submissions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <p className="text-sm text-muted-foreground">No submissions found.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-1 p-2">
        {submissions.map((sub) => {
          const firstSel = sub.position_selections[0];
          return (
            <button
              key={sub.id}
              onClick={() => onSelect(sub.id)}
              className={cn(
                "w-full text-left rounded-lg border p-3 transition-colors hover:bg-accent/50 cursor-pointer",
                selectedId === sub.id ? "bg-accent border-primary/30" : "border-transparent",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{sub.full_name}</p>
                  <p className="text-xs text-muted-foreground truncate">{sub.email}</p>
                </div>
                {firstSel && (
                  <Badge
                    variant="outline"
                    className={cn(
                      "shrink-0 text-[10px]",
                      reviewStatusBadgeClassName(firstSel.status),
                    )}
                  >
                    {firstSel.status}
                  </Badge>
                )}
              </div>
              {sub.position_selections.length > 0 && (
                <p className="mt-1 text-xs text-muted-foreground truncate">
                  {sub.position_selections.map((s) => s.position_name).join(" · ")}
                </p>
              )}
              {!sub.interested_in_returning && (
                <Badge variant="secondary" className="mt-1 text-[10px]">
                  {sub.interested_in_future_term
                    ? `Interested in ${sub.interested_in_future_term}`
                    : "Not Returning"}
                </Badge>
              )}
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
}
