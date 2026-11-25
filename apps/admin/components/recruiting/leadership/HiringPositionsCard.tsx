"use client";

import { useState } from "react";
import { MAX_POSITION_OPENINGS } from "@uwdsc/common/constants";
import Link from "next/link";
import { ArrowRight, Minus, Plus } from "lucide-react";
import type { HiringPick } from "@uwdsc/common/schemas";
import type { ExecPositionInfo } from "@uwdsc/common/types";
import { Button, Card, Checkbox, cn } from "@uwdsc/ui";
import {
  CreatePositionDialog,
  type CreatePositionTarget,
} from "@/components/recruiting/structure/CreatePositionDialog";

interface HiringPositionsCardProps {
  readonly positions: ExecPositionInfo[];
  readonly presidentsSubteamId: number;
  readonly retired: ReadonlySet<number>;
  readonly hiring: HiringPick[];
  readonly openVpSeats: ReadonlyMap<number, number>;
  readonly readOnly: boolean;
  readonly disabled: boolean;
  readonly canAddPositions: boolean;
  readonly onChange: (hiring: HiringPick[]) => void;
  readonly onPositionCreated: (position: {
    positionId: number;
    isVp: boolean;
  }) => Promise<void>;
}

interface Group {
  id: number;
  name: string;
  positions: ExecPositionInfo[];
}

export function HiringPositionsCard({
  positions,
  presidentsSubteamId,
  retired,
  hiring,
  openVpSeats,
  readOnly,
  disabled,
  canAddPositions,
  onChange,
  onPositionCreated,
}: HiringPositionsCardProps) {
  const [creating, setCreating] = useState<CreatePositionTarget | null>(null);
  const picks = new Map(hiring.map((pick) => [pick.positionId, pick.openings]));

  // Every subteam except Presidents gets a group, even one with only a VP position so far,
  // so exec positions can be added to a brand-new subteam.
  const groupsById = new Map<number, Group>();
  for (const position of positions) {
    if (position.subteamId === null || position.subteamId === presidentsSubteamId) continue;
    const group = groupsById.get(position.subteamId) ?? {
      id: position.subteamId,
      name: position.subteamName ?? "Other",
      positions: [],
    };
    const isOpenVp = position.isVp && openVpSeats.has(position.id);
    if (!position.isVp || isOpenVp) group.positions.push(position);
    groupsById.set(position.subteamId, group);
  }
  const groups = [...groupsById.values()].filter(
    (group) => group.positions.length > 0 || (canAddPositions && !retired.has(group.id))
  );
  const subteamOptions = groups.map((group) => ({ id: group.id, name: group.name }));

  const vpOpenings = [...openVpSeats.values()].reduce((sum, n) => sum + n, 0);
  const totalPositions = hiring.length + openVpSeats.size;
  const totalOpenings = hiring.reduce((sum, pick) => sum + pick.openings, 0) + vpOpenings;

  const setOpenings = (positionId: number, openings: number | null) => {
    const next = hiring.filter((pick) => pick.positionId !== positionId);
    if (openings !== null) next.push({ positionId, openings });
    onChange(next);
  };

  return (
    <Card className="gap-0 py-0">
      <div className="flex flex-wrap items-center gap-3 border-b px-4 py-4 sm:px-5">
        <div className="min-w-0 flex-[1_1_240px]">
          <h3 className="text-[15px] font-semibold">Hiring positions</h3>
          <p className="text-sm text-muted-foreground">
            {readOnly
              ? "Open and close positions, and change openings, in Setup."
              : "Pick which exec positions open this term and how many people each needs."}
          </p>
        </div>
        <span className="text-sm font-medium">
          {totalPositions} {totalPositions === 1 ? "position" : "positions"} · {totalOpenings}{" "}
          {totalOpenings === 1 ? "opening" : "openings"}
        </span>
        {readOnly && (
          <Button asChild variant="outline" size="sm">
            <Link href="/recruiting/setup">
              Open Setup
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        )}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4">
        {groups.map((group) => {
          const groupRetired = retired.has(group.id);
          return (
            <div
              key={group.id}
              className={cn(
                "border-b px-4 pt-3.5 pb-4 sm:border-r",
                groupRetired && "opacity-60"
              )}
            >
              <div className="mb-2 flex items-center gap-2">
                <h4 className="text-[13px] font-semibold">{group.name}</h4>
                {groupRetired && (
                  <span className="text-[11px] text-muted-foreground">Not continuing</span>
                )}
                {canAddPositions && !groupRetired && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto h-7 px-2 text-xs text-muted-foreground"
                    disabled={disabled}
                    aria-label={`New position in ${group.name}`}
                    onClick={() =>
                      setCreating({
                        subteams: subteamOptions,
                        subteamId: group.id,
                        allowVp: true,
                        openInCycle: false,
                      })
                    }
                  >
                    <Plus className="size-3.5" aria-hidden />
                    Position
                  </Button>
                )}
              </div>
              {group.positions.length === 0 && (
                <p className="text-xs text-muted-foreground">No exec positions yet.</p>
              )}
              <ul className="flex flex-col gap-0.5">
                {group.positions.map((position) => {
                  const vpSeats = position.isVp ? openVpSeats.get(position.id) : undefined;
                  const openings = vpSeats ?? picks.get(position.id);
                  const on = openings !== undefined;
                  const locked = readOnly || disabled || groupRetired || vpSeats !== undefined;
                  return (
                    <li key={position.id} className="flex min-h-9 items-center gap-2">
                      <Checkbox
                        checked={on}
                        disabled={locked}
                        aria-label={position.name}
                        onCheckedChange={(checked) =>
                          setOpenings(position.id, checked ? 1 : null)
                        }
                      />
                      <div className="min-w-0 flex-1">
                        <div
                          className={cn(
                            "text-[13px] leading-[18px]",
                            !on && "text-muted-foreground"
                          )}
                        >
                          {position.name}
                        </div>
                        {vpSeats !== undefined && (
                          <div className="text-[11px] leading-[14px] text-muted-foreground">
                            From the open VP seat
                          </div>
                        )}
                      </div>
                      {on && (
                        <div className="flex h-8 flex-none items-center rounded-md border sm:h-7">
                          <button
                            type="button"
                            aria-label={`Fewer openings for ${position.name}`}
                            disabled={locked || (openings ?? 1) <= 1}
                            onClick={() => setOpenings(position.id, (openings ?? 1) - 1)}
                            className="flex h-full w-8 items-center justify-center text-muted-foreground disabled:opacity-40 sm:w-6"
                          >
                            <Minus className="size-3" aria-hidden />
                          </button>
                          <span className="min-w-[18px] text-center text-[13px] font-semibold tabular-nums">
                            {openings}
                          </span>
                          <button
                            type="button"
                            aria-label={`More openings for ${position.name}`}
                            disabled={locked || (openings ?? 1) >= MAX_POSITION_OPENINGS}
                            onClick={() => setOpenings(position.id, (openings ?? 1) + 1)}
                            className="flex h-full w-8 items-center justify-center text-muted-foreground disabled:opacity-40 sm:w-6"
                          >
                            <Plus className="size-3" aria-hidden />
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
      <CreatePositionDialog
        target={creating}
        onClose={() => setCreating(null)}
        onCreated={onPositionCreated}
      />
    </Card>
  );
}
