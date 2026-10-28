"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { toast } from "sonner";
import { AlertCircle, CheckCircle2, Lock } from "lucide-react";
import { buildRoster, checkLockReadiness, computeRoleChanges } from "@uwdsc/common/recruiting";
import type { HiringPick, LeadershipDraft, LeadershipSlot } from "@uwdsc/common/schemas";
import type { LeadershipPerson, LeadershipView, RoleState } from "@uwdsc/common/types";
import { formatTermCode } from "@uwdsc/common/utils";
import { Button, Spinner } from "@uwdsc/ui";
import { useAuth } from "@/contexts/AuthContext";
import { useRecruiting } from "@/contexts/RecruitingContext";
import {
  getLeadership,
  lockLeadership,
  saveLeadershipDraft,
  updateLeadership,
} from "@/lib/api";
import { HiringPositionsCard } from "./HiringPositionsCard";
import { LockConfirmDialog } from "./LockConfirmDialog";
import { PresidentsCard } from "./PresidentsCard";
import type { SlotEditor } from "@/types/recruiting";
import { VicePresidentsCard } from "./VicePresidentsCard";

/** Recruiting → Leadership: next term's presidents and VPs, hiring picks, and the lock. */
export function LeadershipPage() {
  const { data, error, isLoading, mutate } = useSWR<LeadershipView, Error>(
    "/api/recruiting/leadership",
    getLeadership,
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );
  const [version, setVersion] = useState(0);

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner className="size-8" />
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
        Couldn&apos;t load leadership: {error?.message ?? "unknown error"}
      </div>
    );
  }

  return (
    <LeadershipEditor
      key={version}
      view={data}
      onSaved={async (next) => {
        if (next) await mutate(next, { revalidate: false });
        else await mutate();
        setVersion((v) => v + 1);
      }}
    />
  );
}

function newSlotId() {
  return crypto.randomUUID();
}

interface LeadershipEditorProps {
  readonly view: LeadershipView;
  readonly onSaved: (next: LeadershipView | null) => Promise<void>;
}

function LeadershipEditor({ view, onSaved }: LeadershipEditorProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { capabilities, refresh } = useRecruiting();
  const [slots, setSlots] = useState<LeadershipSlot[]>(view.draft.slots);
  const [hiring, setHiring] = useState<HiringPick[]>(() =>
    view.hiring
      .filter((row) => row.isOpen)
      .filter((row) => !view.positions.find((p) => p.id === row.positionId)?.isVp)
      .map((row) => ({ positionId: row.positionId, openings: row.openings }))
  );
  const [people, setPeople] = useState(view.people);
  const [dirty, setDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const targetLabel = capabilities?.cycle
    ? formatTermCode(capabilities.cycle.targetTermCode)
    : "next term";
  const draft: LeadershipDraft = useMemo(() => ({ slots }), [slots]);

  const subteamNames = useMemo(() => {
    const names = new Map<number, string>();
    for (const position of view.positions) {
      if (position.subteamId !== null && position.subteamName) {
        names.set(position.subteamId, position.subteamName);
      }
    }
    return names;
  }, [view.positions]);

  const names = useMemo(
    () => Object.fromEntries(Object.values(people).map((p) => [p.id, p.name])),
    [people]
  );
  const readiness = useMemo(
    () => checkLockReadiness(draft, view.structure, names),
    [draft, view.structure, names]
  );
  const roster = useMemo(() => buildRoster(draft, view.structure), [draft, view.structure]);
  const changeSet = useMemo(() => {
    const roles: Record<string, RoleState> = Object.fromEntries(
      Object.values(people).map((p) => [p.id, { role: p.role, subteamId: p.subteamId }])
    );
    return computeRoleChanges(roster, view.baseline, roles);
  }, [roster, view.baseline, people]);

  const openVpSeats = useMemo(() => {
    const seats = new Map<number, number>();
    for (const slot of slots) {
      if (slot.kind === "vp" && slot.decision === "open") {
        seats.set(slot.positionId, (seats.get(slot.positionId) ?? 0) + 1);
      }
    }
    return seats;
  }, [slots]);

  const hiringSummary = useMemo(() => {
    const vpOpenings = [...openVpSeats.values()].reduce((sum, n) => sum + n, 0);
    const positions = hiring.length + openVpSeats.size;
    const openings = hiring.reduce((sum, pick) => sum + pick.openings, 0) + vpOpenings;
    return `${positions} ${positions === 1 ? "position" : "positions"}, ${openings} ${openings === 1 ? "opening" : "openings"}`;
  }, [hiring, openVpSeats]);

  const change = (next: LeadershipSlot[]) => {
    setSlots(next);
    setDirty(true);
  };

  const editor: SlotEditor = {
    people,
    subteamNames,
    seatedIds: new Set(roster.map((entry) => entry.profileId)),
    disabled: isSaving,
    update: (slotId, patch) =>
      change(slots.map((slot) => (slot.id === slotId ? { ...slot, ...patch } : slot))),
    remove: (slotId) => change(slots.filter((slot) => slot.id !== slotId)),
    pick: (slotId, person: LeadershipPerson) => {
      setPeople((current) => ({ ...current, [person.id]: person }));
      change(
        slots.map((slot) =>
          slot.id === slotId
            ? { ...slot, decision: "successor", successorProfileId: person.id }
            : slot
        )
      );
    },
    addPresident: () =>
      change([
        ...slots,
        {
          id: newSlotId(),
          kind: "pres",
          positionId: view.structure.presidentPositionId,
          outgoingProfileId: null,
          decision: "successor",
          successorProfileId: null,
        },
      ]),
    addVp: (positionId) =>
      change([
        ...slots,
        {
          id: newSlotId(),
          kind: "vp",
          positionId,
          outgoingProfileId: null,
          decision: "successor",
          successorProfileId: null,
        },
      ]),
  };

  const afterRoleChange = async () => {
    await refresh();
    router.refresh();
  };

  const saveDraft = async () => {
    setIsSaving(true);
    try {
      const next = await saveLeadershipDraft(draft, hiring);
      toast.success("Draft saved");
      await onSaved(next);
    } catch (err) {
      toast.error((err as Error).message || "Couldn't save the draft");
      setIsSaving(false);
    }
  };

  const confirm = async () => {
    setIsSaving(true);
    try {
      if (view.locked) {
        const next = await updateLeadership(draft);
        toast.success("Leadership updated");
        await onSaved(next);
      } else {
        await lockLeadership(draft, hiring);
        toast.success("Leadership locked. Recruiting is open for VPs.");
        await onSaved(null);
      }
      await afterRoleChange();
    } catch (err) {
      toast.error((err as Error).message || "Couldn't save leadership");
      setIsSaving(false);
    }
  };

  const presidentSlots = slots.filter((slot) => slot.kind === "pres");
  const progress = readiness.total === 0 ? 0 : (readiness.decided / readiness.total) * 100;
  const hasChanges = changeSet.changes.length > 0 || dirty;

  return (
    <div className="flex flex-col gap-6 pb-4">
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-0 flex-[1_1_420px]">
          <h2 className="text-lg font-semibold">Next term&apos;s leadership</h2>
          <p className="mt-1 max-w-2xl text-sm leading-[22px] text-muted-foreground">
            {view.locked
              ? `Leadership for ${targetLabel} is locked. Changes here apply roles immediately.`
              : `Decide what happens to each president and VP seat for ${targetLabel}, then pick which exec positions are hiring. Recruiting unlocks for every VP when you lock this.`}
          </p>
        </div>
        <div className="flex-[0_0_240px]">
          <div className="mb-1.5 flex justify-between text-xs">
            <span className="font-semibold">
              {readiness.decided} of {readiness.total} seats decided
            </span>
            <span className="text-muted-foreground">
              {readiness.total - readiness.decided} left
            </span>
          </div>
          <div
            role="progressbar"
            aria-label="Seats decided"
            aria-valuemin={0}
            aria-valuemax={readiness.total}
            aria-valuenow={readiness.decided}
            className="h-1.5 overflow-hidden rounded-full bg-muted"
          >
            <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {view.unplaced.length > 0 && (
        <p className="rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
          {view.unplaced.map((id) => view.people[id]?.name ?? "Someone").join(", ")}{" "}
          {view.unplaced.length === 1 ? "is a VP" : "are VPs"} on a subteam with no VP position.
          Fix their subteam in Members before locking.
        </p>
      )}

      <PresidentsCard slots={presidentSlots} editor={editor} targetLabel={targetLabel} />
      <VicePresidentsCard structure={view.structure} slots={slots} editor={editor} />
      <HiringPositionsCard
        positions={view.positions}
        hiring={hiring}
        openVpSeats={openVpSeats}
        readOnly={view.locked}
        disabled={isSaving}
        onChange={(next) => {
          setHiring(next);
          setDirty(true);
        }}
      />

      <div className="sticky bottom-4 z-10 flex flex-wrap items-center gap-3 rounded-xl border bg-card py-3.5 pr-4 pl-5 shadow-lg">
        {readiness.ready ? (
          <CheckCircle2 className="size-5 flex-none text-emerald-600" aria-hidden />
        ) : (
          <AlertCircle className="size-5 flex-none text-amber-600" aria-hidden />
        )}
        <div className="min-w-0 flex-[1_1_320px]">
          <div className="text-sm font-semibold">
            {readiness.ready
              ? view.locked
                ? hasChanges
                  ? `${changeSet.changes.length} role ${changeSet.changes.length === 1 ? "change" : "changes"} to apply`
                  : "Leadership is locked"
                : "Every seat is decided"
              : `${readiness.blockers.length} ${readiness.blockers.length === 1 ? "thing" : "things"} to fix before you ${view.locked ? "apply" : "lock"}`}
          </div>
          <div id="lock-why" className="text-[13px] text-muted-foreground">
            {readiness.ready
              ? view.locked
                ? "Review the role changes before applying."
                : "Review the role changes, then lock."
              : readiness.blockers.slice(0, 2).join(". ")}
          </div>
        </div>
        {!view.locked && (
          <Button variant="outline" disabled={isSaving || !dirty} onClick={saveDraft}>
            Save draft
          </Button>
        )}
        <Button
          disabled={
            isSaving ||
            !readiness.ready ||
            view.unplaced.length > 0 ||
            (view.locked && !hasChanges)
          }
          aria-describedby="lock-why"
          onClick={() => setConfirmOpen(true)}
        >
          <Lock aria-hidden />
          {view.locked ? "Apply changes" : "Lock leadership"}
        </Button>
      </div>

      <LockConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        mode={view.locked ? "apply" : "lock"}
        targetLabel={targetLabel}
        changeSet={changeSet}
        people={people}
        subteamNames={subteamNames}
        hiringSummary={hiringSummary}
        viewerId={user?.id ?? null}
        isSubmitting={isSaving}
        onConfirm={confirm}
      />
    </div>
  );
}
