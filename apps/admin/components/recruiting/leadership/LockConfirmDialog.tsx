"use client";

import { ArrowRight, Lock, TriangleAlert } from "lucide-react";
import type { LeadershipPerson, RoleChange, RoleChangeSet } from "@uwdsc/common/types";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Spinner,
} from "@uwdsc/ui";
import { ROLE_CHANGE_GROUPS } from "@/constants/recruiting";
import { PersonAvatar } from "./PersonAvatar";
import { roleLabel } from "@/lib/utils/recruiting";

interface LockConfirmDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly mode: "lock" | "apply";
  readonly targetLabel: string;
  readonly changeSet: RoleChangeSet;
  readonly people: Record<string, LeadershipPerson>;
  readonly subteamNames: ReadonlyMap<number, string>;
  readonly hiringSummary: string;
  readonly viewerId: string | null;
  readonly isSubmitting: boolean;
  readonly onConfirm: () => void;
}

export function LockConfirmDialog({
  open,
  onOpenChange,
  mode,
  targetLabel,
  changeSet,
  people,
  subteamNames,
  hiringSummary,
  viewerId,
  isSubmitting,
  onConfirm,
}: LockConfirmDialogProps) {
  const nameOf = (id: string) => people[id]?.name ?? "Someone";
  const viewerChange = changeSet.changes.find((change) => change.profileId === viewerId);
  const viewerLosesAccess = viewerChange !== undefined && viewerChange.to.role !== "pres";

  const unchanged = changeSet.unchanged
    .map(
      (entry) =>
        `${nameOf(entry.profileId)} (${roleLabel({ role: entry.role, subteamId: entry.subteamId }, subteamNames)})`
    )
    .join(", ");

  return (
    <Dialog open={open} onOpenChange={(next) => !isSubmitting && onOpenChange(next)}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader className="flex-row gap-3.5 text-left">
          <span
            aria-hidden
            className="flex size-10 flex-none items-center justify-center rounded-lg bg-primary/15 text-primary"
          >
            <Lock className="size-4.5" />
          </span>
          <div>
            <DialogTitle>
              {mode === "lock"
                ? `Lock leadership for ${targetLabel}?`
                : "Apply leadership changes?"}
            </DialogTitle>
            <DialogDescription className="mt-1">
              {mode === "lock"
                ? "Roles change as soon as you lock, and Recruiting opens for every VP."
                : "These role changes take effect immediately."}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="flex max-h-[55vh] flex-col gap-3.5 overflow-y-auto">
          {changeSet.changes.length === 0 && (
            <p className="text-sm text-muted-foreground">No one&apos;s role changes.</p>
          )}
          {ROLE_CHANGE_GROUPS.map(({ key, title, icon: Icon }) => {
            const changes = changeSet.changes.filter((change) => change.group === key);
            if (changes.length === 0) return null;
            return (
              <section key={key} className="overflow-hidden rounded-lg border">
                <div className="flex items-center gap-2 border-b bg-muted/40 px-3 py-2">
                  <Icon className="size-3.5" aria-hidden />
                  <h3 className="text-[13px] font-semibold">{title}</h3>
                  <span className="text-xs text-muted-foreground">{changes.length}</span>
                </div>
                <ul className="py-1">
                  {changes.map((change) => (
                    <ChangeRow
                      key={change.profileId}
                      change={change}
                      name={nameOf(change.profileId)}
                      subteamNames={subteamNames}
                    />
                  ))}
                </ul>
              </section>
            );
          })}
          <p className="text-xs leading-[18px] text-muted-foreground">
            {unchanged ? `No change: ${unchanged}. ` : ""}
            Hiring: {hiringSummary}.
          </p>
          {viewerLosesAccess && (
            <p className="flex items-start gap-2 rounded-md bg-amber-500/15 px-3 py-2 text-sm text-amber-900 dark:text-amber-200">
              <TriangleAlert className="mt-0.5 size-4 flex-none" aria-hidden />
              You&apos;re no longer a president after this, so you&apos;ll lose access to
              Recruiting leadership.
            </p>
          )}
        </div>

        <DialogFooter className="items-center gap-2 border-t pt-4 sm:justify-between">
          <span className="text-xs text-muted-foreground">
            Every change is logged. Presidents can edit the roster later.
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button disabled={isSubmitting} onClick={onConfirm}>
              {isSubmitting ? <Spinner className="size-4" /> : <Lock aria-hidden />}
              {mode === "lock" ? "Lock leadership" : "Apply changes"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ChangeRow({
  change,
  name,
  subteamNames,
}: {
  readonly change: RoleChange;
  readonly name: string;
  readonly subteamNames: ReadonlyMap<number, string>;
}) {
  return (
    <li className="flex items-center gap-2.5 px-3 py-1.5">
      <PersonAvatar name={name} className="size-6.5 text-[10px]" />
      <span className="w-36 flex-none truncate text-[13px] font-medium">{name}</span>
      <span className="flex min-w-0 flex-1 items-center gap-1.5 text-[13px] text-muted-foreground">
        {roleLabel(change.from, subteamNames)}
        <ArrowRight className="size-3.5" aria-hidden />
        <span className="font-medium text-foreground">
          {roleLabel(change.to, subteamNames)}
        </span>
      </span>
    </li>
  );
}
