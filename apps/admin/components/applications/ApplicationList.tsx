"use client";

import { ScrollArea, Badge, cn } from "@uwdsc/ui";

import type { ApplicationListItem } from "@uwdsc/common/types";

// Status -> badge variant mapping
function getStatusVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "submitted":
      return "secondary";
    case "under_review":
      return "default";
    case "accepted":
      return "default";
    case "rejected":
      return "destructive";
    default:
      return "outline";
  }
}

function getStatusLabel(status: string): string {
  return status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

interface ApplicationListProps {
  readonly applications: ApplicationListItem[];
  readonly selectedId: string | null;
  readonly onSelect: (id: string) => void;
}

export function ApplicationList({
  applications,
  selectedId,
  onSelect,
}: ApplicationListProps) {
  if (applications.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <p className="text-sm text-muted-foreground">No applications found.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-1 p-2">
        {applications.map((app) => (
          <button
            key={app.id}
            onClick={() => onSelect(app.id)}
            className={cn(
              "w-full text-left rounded-lg border p-3 transition-colors hover:bg-accent/50 cursor-pointer",
              selectedId === app.id
                ? "border-primary bg-accent"
                : "border-transparent",
            )}
          >
            {/* Name + status */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className="font-medium text-sm leading-tight truncate">
                {app.full_name}
              </span>
              <Badge
                variant={getStatusVariant(app.status)}
                className="shrink-0 text-[10px] px-1.5 py-0"
              >
                {getStatusLabel(app.status)}
              </Badge>
            </div>

            {/* Program */}
            {(app.major || app.year_of_study) && (
              <p className="text-xs text-muted-foreground truncate mb-1.5">
                {[app.major, app.year_of_study].filter(Boolean).join(" · ")}
              </p>
            )}

            {/* Position selections */}
            {app.position_selections.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {app.position_selections.map((sel) => (
                  <Badge
                    key={sel.id}
                    variant="outline"
                    className="text-[10px] px-1.5 py-0"
                  >
                    {sel.position_name}
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
