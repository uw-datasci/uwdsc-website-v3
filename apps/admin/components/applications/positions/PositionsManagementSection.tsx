"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  Switch
} from "@uwdsc/ui";
import type { ManagablePosition } from "@uwdsc/common/types";

interface PositionsManagementSectionProps {
  readonly positions: ManagablePosition[];
  readonly pendingIds: ReadonlySet<number>;
  readonly onToggle: (position: ManagablePosition, nextAvailable: boolean) => void;
}

const UNASSIGNED_SUBTEAM = "Other";

export function PositionsManagementSection({
  positions,
  pendingIds,
  onToggle
}: PositionsManagementSectionProps) {
  const groups = useMemo(() => {
    const bySubteam = new Map<string, ManagablePosition[]>();
    for (const position of positions) {
      const key = position.subteam_name ?? UNASSIGNED_SUBTEAM;
      const list = bySubteam.get(key) ?? [];
      list.push(position);
      bySubteam.set(key, list);
    }
    for (const list of bySubteam.values()) {
      list.sort((a, b) => {
        if (a.is_vp !== b.is_vp) return a.is_vp ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
    }
    return Array.from(bySubteam.entries());
  }, [positions]);

  if (positions.length === 0) {
    return <p className="text-sm text-muted-foreground">No positions are configured yet.</p>;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Positions</CardTitle>
        <CardDescription>
          Toggle a role on to let members select it on the public application. Turning a role
          off hides it from new applicants — existing applications for that role and its
          questions are kept, they just aren&apos;t deleted. VP roles are listed first within
          each subteam. This does not affect the returning exec form — returning execs can
          choose any role except Presidents and Advisors.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {groups.map(([subteamName, subteamPositions]) => (
            <div
              key={subteamName}
              className="mb-4 break-inside-avoid space-y-3 rounded-md border p-3"
            >
              <h3 className="text-sm font-medium text-muted-foreground">{subteamName}</h3>
              <div className="space-y-2">
                {subteamPositions.map((position) => {
                  const pending = pendingIds.has(position.exec_position_id);
                  const inputId = `position-toggle-${position.exec_position_id}`;
                  return (
                    <div
                      key={position.exec_position_id}
                      className="flex items-center justify-between gap-3"
                    >
                      <Label htmlFor={inputId} className="font-normal">
                        {position.name}
                      </Label>
                      <Switch
                        id={inputId}
                        checked={position.is_available}
                        disabled={pending}
                        onCheckedChange={(checked) => onToggle(position, checked)}
                        aria-label={`Toggle ${position.name} availability for the public application`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
