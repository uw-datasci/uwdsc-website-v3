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
        {submissions.map((sub) => (
          <button
            key={sub.id}
            onClick={() => onSelect(sub.id)}
            className={cn(
              "w-full text-left rounded-lg border p-3 transition-colors hover:bg-accent/50 cursor-pointer",
              selectedId === sub.id ? "bg-accent border-primary/30" : "border-transparent"
            )}
          >
            <div className="min-w-0 mb-1">
              <p className="font-medium text-sm truncate">{sub.full_name}</p>
              <p className="text-xs text-muted-foreground truncate">{sub.email}</p>
            </div>
            {sub.position_selections.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {sub.position_selections.map((sel) => (
                  <Badge
                    key={sel.id}
                    variant="outline"
                    className={cn(
                      "max-w-full truncate px-1.5 py-0 text-[10px] font-medium",
                      reviewStatusBadgeClassName(sel.status)
                    )}
                    title={`${sel.position_name}: ${sel.status}`}
                  >
                    {sel.position_name}: {sel.status}
                  </Badge>
                ))}
              </div>
            )}
            {!sub.interested_in_returning && (
              <Badge variant="secondary" className="mt-1 text-[10px]">
                {sub.interested_in_future_term
                  ? `Interested in ${sub.interested_in_future_term}`
                  : "Not Returning"}
              </Badge>
            )}
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
