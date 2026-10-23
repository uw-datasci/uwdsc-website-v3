"use client";

import { MAX_POSITION_OPENINGS } from "@uwdsc/common/constants";
import Link from "next/link";
import { ArrowRight, Minus, Plus } from "lucide-react";
import type { HiringPick } from "@uwdsc/common/schemas";
import type { ExecPositionInfo } from "@uwdsc/common/types";
import { Button, Card, Checkbox, cn } from "@uwdsc/ui";

interface HiringPositionsCardProps {
  readonly positions: ExecPositionInfo[];
  readonly hiring: HiringPick[];
  readonly openVpSeats: ReadonlyMap<number, number>;
  readonly readOnly: boolean;
  readonly disabled: boolean;
  readonly onChange: (hiring: HiringPick[]) => void;
}

export function HiringPositionsCard({
  positions,
  hiring,
  openVpSeats,
  readOnly,
  disabled,
  onChange,
}: HiringPositionsCardProps) {
  const picks = new Map(hiring.map((pick) => [pick.positionId, pick.openings]));
  const groups = new Map<string, ExecPositionInfo[]>();
  for (const position of positions) {
    if (position.subteamId === null) continue;
    const isOpenVp = position.isVp && openVpSeats.has(position.id);
    if (position.isVp && !isOpenVp) continue;
    const key = position.subteamName ?? "Other";
    groups.set(key, [...(groups.get(key) ?? []), position]);
  }

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
      <div className="flex flex-wrap items-center gap-3 border-b px-5 py-4">
        <div className="flex-1">
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
        {[...groups.entries()].map(([subteamName, groupPositions]) => (
          <div key={subteamName} className="border-b px-4 pt-3.5 pb-4 sm:border-r">
            <h4 className="mb-2 text-[13px] font-semibold">{subteamName}</h4>
            <ul className="flex flex-col gap-0.5">
              {groupPositions.map((position) => {
                const vpSeats = position.isVp ? openVpSeats.get(position.id) : undefined;
                const openings = vpSeats ?? picks.get(position.id);
                const on = openings !== undefined;
                const locked = readOnly || disabled || vpSeats !== undefined;
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
                      <div className="flex h-7 flex-none items-center rounded-md border">
                        <button
                          type="button"
                          aria-label={`Fewer openings for ${position.name}`}
                          disabled={locked || (openings ?? 1) <= 1}
                          onClick={() => setOpenings(position.id, (openings ?? 1) - 1)}
                          className="flex h-full w-6 items-center justify-center text-muted-foreground disabled:opacity-40"
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
                          className="flex h-full w-6 items-center justify-center text-muted-foreground disabled:opacity-40"
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
        ))}
      </div>
    </Card>
  );
}
