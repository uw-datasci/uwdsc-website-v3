"use client";

import { MAX_POSITION_OPENINGS } from "@uwdsc/common/constants";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Minus, Plus } from "lucide-react";
import type { UpdatePositionInput } from "@uwdsc/common/schemas";
import type { SetupPosition, SetupView } from "@uwdsc/common/types";
import {
  Badge,
  Button,
  Card,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  cn,
} from "@uwdsc/ui";
import { addCyclePosition, updateCyclePosition } from "@/lib/api";

interface PositionsCardProps {
  readonly view: SetupView;
  readonly onSaved: () => Promise<void>;
}

export function PositionsCard({ view, onSaved }: PositionsCardProps) {
  const editable = view.canEditSchedule;
  const [busyId, setBusyId] = useState<number | null>(null);
  const [toAdd, setToAdd] = useState("");

  const groups = new Map<string, SetupPosition[]>();
  for (const position of view.positions) {
    const key = position.subteamName ?? "Other";
    groups.set(key, [...(groups.get(key) ?? []), position]);
  }
  const open = view.positions.filter((p) => p.isOpen);
  const openings = open.reduce((sum, p) => sum + p.openings, 0);

  const patch = async (position: SetupPosition, change: UpdatePositionInput) => {
    setBusyId(position.id);
    try {
      await updateCyclePosition(position.id, change);
      await onSaved();
    } catch (err) {
      toast.error((err as Error).message || "Couldn't update the position");
    } finally {
      setBusyId(null);
    }
  };

  const add = async () => {
    if (!toAdd) return;
    setBusyId(-1);
    try {
      await addCyclePosition(Number(toAdd));
      setToAdd("");
      await onSaved();
    } catch (err) {
      toast.error((err as Error).message || "Couldn't add the position");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Card className="gap-0 py-0">
      <div className="flex flex-wrap items-center gap-3 border-b px-5 py-4">
        <div className="flex-1">
          <h3 className="text-[15px] font-semibold">Positions</h3>
          <p className="text-sm text-muted-foreground">
            {editable
              ? "Close a position to stop new applications for it. VP seats are opened from Leadership."
              : "Positions open this cycle. Presidents open and close them."}
          </p>
        </div>
        <span className="text-sm font-medium">
          {open.length} open · {openings} {openings === 1 ? "opening" : "openings"}
        </span>
      </div>

      {view.positions.length === 0 && (
        <p className="px-5 py-6 text-sm text-muted-foreground">
          No positions in this cycle yet. Presidents pick hiring positions in Leadership.
        </p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3">
        {[...groups.entries()].map(([subteam, positions]) => (
          <div key={subteam} className="border-b px-4 pt-3.5 pb-4 sm:border-r">
            <h4 className="mb-2 text-[13px] font-semibold">{subteam}</h4>
            <ul className="flex flex-col gap-1">
              {positions.map((position) => {
                const busy = busyId === position.id;
                return (
                  <li key={position.id} className="flex min-h-10 items-center gap-2.5">
                    <LockedReason reason={switchLock(editable, position.isVp)}>
                      <Switch
                        checked={position.isOpen}
                        disabled={!editable || position.isVp || busy}
                        aria-label={`${position.name} open`}
                        onCheckedChange={(isOpen) => patch(position, { isOpen })}
                      />
                    </LockedReason>
                    <div className="min-w-0 flex-1">
                      <div
                        className={cn(
                          "flex items-center gap-1.5 text-[13px]",
                          !position.isOpen && "text-muted-foreground"
                        )}
                      >
                        {position.name}
                        {position.isVp && (
                          <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
                            VP seat
                          </Badge>
                        )}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {position.applicants}{" "}
                        {position.applicants === 1 ? "applicant" : "applicants"}
                      </div>
                    </div>
                    <div className="flex h-7 flex-none items-center rounded-md border">
                      <button
                        type="button"
                        aria-label={`Fewer openings for ${position.name}`}
                        disabled={!editable || busy || position.openings <= 1}
                        onClick={() => patch(position, { openings: position.openings - 1 })}
                        className="flex h-full w-6 items-center justify-center text-muted-foreground disabled:opacity-40"
                      >
                        <Minus className="size-3" aria-hidden />
                      </button>
                      <span className="min-w-[18px] text-center text-[13px] font-semibold tabular-nums">
                        {position.openings}
                      </span>
                      <button
                        type="button"
                        aria-label={`More openings for ${position.name}`}
                        disabled={
                          !editable || busy || position.openings >= MAX_POSITION_OPENINGS
                        }
                        onClick={() => patch(position, { openings: position.openings + 1 })}
                        className="flex h-full w-6 items-center justify-center text-muted-foreground disabled:opacity-40"
                      >
                        <Plus className="size-3" aria-hidden />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {editable && view.addablePositions.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 px-5 py-3">
          <Select value={toAdd} onValueChange={setToAdd}>
            <SelectTrigger size="sm" className="w-64" aria-label="Position to add">
              <SelectValue placeholder="Add a position" />
            </SelectTrigger>
            <SelectContent>
              {view.addablePositions.map((position) => (
                <SelectItem key={position.id} value={String(position.id)}>
                  {position.name}
                  {position.subteamName ? ` · ${position.subteamName}` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" variant="outline" disabled={!toAdd || busyId === -1} onClick={add}>
            <Plus aria-hidden />
            Add
          </Button>
        </div>
      )}
    </Card>
  );
}

function switchLock(editable: boolean, isVp: boolean): string | null {
  if (!editable) return "Presidents open and close positions.";
  if (isVp) return "VP seats are opened from Leadership.";
  return null;
}

/** Tooltip on a disabled control explaining why. */
function LockedReason({
  reason,
  children,
}: {
  readonly reason: string | null;
  readonly children: ReactNode;
}) {
  if (!reason) return children;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span tabIndex={0} className="inline-flex rounded-full">
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent>{reason}</TooltipContent>
    </Tooltip>
  );
}
