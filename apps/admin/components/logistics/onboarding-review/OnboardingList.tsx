"use client";

import { ScrollArea, Badge, cn } from "@uwdsc/ui";
import { CheckCircle2, Clock } from "lucide-react";
import type { OnboardingAdminRow } from "@uwdsc/common/types";

interface OnboardingListProps {
  readonly rows: OnboardingAdminRow[];
  readonly selectedId: string | null;
  readonly onSelect: (id: string) => void;
}

export function OnboardingList({
  rows,
  selectedId,
  onSelect,
}: OnboardingListProps) {
  if (rows.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <p className="text-sm text-muted-foreground">No records found.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-1 p-2">
        {rows.map((row) => {
          const name =
            [row.first_name, row.last_name].filter(Boolean).join(" ") ||
            "Unknown";
          const position =
            row.submission_role_name || row.exec_position_name || row.user_role;
          const submitted = !!row.submission;

          return (
            <button
              key={row.profile_id}
              onClick={() => onSelect(row.profile_id)}
              className={cn(
                "w-full text-left rounded-lg border p-3 transition-colors hover:bg-accent/50 cursor-pointer",
                selectedId === row.profile_id
                  ? "border-primary bg-accent"
                  : "border-transparent",
              )}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="font-medium text-sm leading-tight truncate">
                  {name}
                </span>
                {submitted ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                ) : (
                  <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}
              </div>

              {row.email && (
                <p className="text-xs text-muted-foreground truncate mb-1">
                  {row.email}
                </p>
              )}

              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  {row.user_role}
                </Badge>
                {position && position !== row.user_role && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0 truncate max-w-[160px]"
                  >
                    {position}
                  </Badge>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
}
