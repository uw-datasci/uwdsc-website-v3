"use client";

import { Badge, ScrollArea, cn } from "@uwdsc/ui";
import type { ApplicationListItem } from "@uwdsc/common/types";

interface ReviewListProps {
  readonly applications: ApplicationListItem[];
  readonly selectedId: string | null;
  readonly onSelect: (id: string) => void;
}

export function ReviewList({
  applications,
  selectedId,
  onSelect,
}: ReviewListProps) {
  if (applications.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <p className="text-sm text-muted-foreground">
          No applications found for this filter.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-1 p-2">
        {applications.map((application) => (
          <button
            key={application.id}
            onClick={() => onSelect(application.id)}
            className={cn(
              "w-full cursor-pointer rounded-lg border p-3 text-left transition-colors hover:bg-accent/50",
              selectedId === application.id
                ? "border-primary bg-accent"
                : "border-transparent",
            )}
          >
            <div className="mb-1">
              <p className="truncate text-sm font-medium leading-tight">
                {application.full_name}
              </p>
              {(application.major || application.year_of_study) && (
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {[application.major, application.year_of_study]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}
            </div>

            {application.position_selections.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {application.position_selections.map((selection) => (
                  <Badge
                    key={selection.id}
                    variant="outline"
                    className="px-1.5 py-0 text-[10px]"
                  >
                    {selection.position_name}: {selection.status}
                  </Badge>
                ))}
              </div>
            )}
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
