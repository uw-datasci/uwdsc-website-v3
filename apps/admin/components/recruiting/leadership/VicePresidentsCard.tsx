"use client";

import { useState } from "react";
import { AlertCircle, Archive, Info, Lock, Plus, Trash2 } from "lucide-react";
import { SLOT_DECISION_LABELS, type SlotDecision } from "@uwdsc/common/constants";
import { slotDecisionOptions, slotNextHolder } from "@uwdsc/common/recruiting";
import type { LeadershipSlot } from "@uwdsc/common/schemas";
import type { LeadershipStructure } from "@uwdsc/common/types";
import {
  Badge,
  Button,
  Card,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  cn,
} from "@uwdsc/ui";
import { CreateSubteamDialog } from "@/components/recruiting/structure/CreateSubteamDialog";
import { PersonAvatar } from "./PersonAvatar";
import { personNow } from "@/lib/utils/recruiting";
import { PersonPicker } from "./PersonPicker";
import { SeatDecision } from "./SeatDecision";
import type { SlotEditor } from "@/types/recruiting";

type Subteam = LeadershipStructure["subteams"][number];

interface VicePresidentsCardProps {
  readonly structure: LeadershipStructure;
  readonly slots: LeadershipSlot[];
  readonly editor: SlotEditor;
}

export function VicePresidentsCard({ structure, slots, editor }: VicePresidentsCardProps) {
  const [creating, setCreating] = useState(false);

  return (
    <Card className="gap-0 py-0">
      <div className="flex flex-wrap items-center gap-3 border-b px-4 py-4 sm:px-5">
        <div className="min-w-0 flex-[1_1_280px]">
          <h3 className="text-[15px] font-semibold">Vice presidents</h3>
          <p className="text-sm text-muted-foreground">
            Give every current VP a status. Co-VPs share a seat, and each still gets their own
            status.
          </p>
        </div>
        {editor.canEditStructure && (
          <Button
            variant="outline"
            size="sm"
            disabled={editor.disabled}
            onClick={() => setCreating(true)}
          >
            <Plus aria-hidden />
            New subteam
          </Button>
        )}
      </div>
      <CreateSubteamDialog
        open={creating}
        onOpenChange={setCreating}
        onCreated={editor.structureChanged}
      />
      <div className="grid gap-4 p-3 sm:p-5 md:grid-cols-2">
        {structure.subteams.map((subteam) => (
          <SubteamBlock
            key={subteam.id}
            subteam={subteam}
            slots={slots.filter(
              (slot) =>
                slot.kind === "vp" && subteam.vpPositions.some((p) => p.id === slot.positionId)
            )}
            editor={editor}
          />
        ))}
      </div>
    </Card>
  );
}

function SubteamBlock({
  subteam,
  slots,
  editor,
}: {
  readonly subteam: Subteam;
  readonly slots: LeadershipSlot[];
  readonly editor: SlotEditor;
}) {
  const retired = editor.retired.has(subteam.id);
  const blocker = retired ? null : editor.retireBlocker(subteam.id);
  const covered = slots.some(
    (slot) => slotNextHolder(slot) !== null || slot.decision === "open"
  );
  const needsDecision =
    !retired && (!covered || slots.some((slot) => slot.decision === "undecided"));
  const switchId = `retire-${subteam.id}`;
  const seats = subteam.vpPositions
    .map((position) => ({
      position,
      slots: slots.filter((slot) => slot.positionId === position.id),
    }))
    .filter((seat) => seat.slots.length > 0);

  return (
    <div className={cn("rounded-lg border bg-muted/30", retired && "border-dashed")}>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 px-3.5 py-3">
        <h4 className={cn("text-sm font-semibold", retired && "text-muted-foreground")}>
          {subteam.name}
        </h4>
        <span className="text-xs text-muted-foreground">
          {seats.length === 1 ? "1 seat" : `${seats.length} seats`}
        </span>
        {retired && (
          <Badge variant="secondary" className="ml-auto">
            <Archive className="size-3" aria-hidden />
            Not continuing
          </Badge>
        )}
        {needsDecision && (
          <Badge
            variant="secondary"
            className="ml-auto bg-amber-500/15 text-amber-800 dark:text-amber-300"
          >
            <AlertCircle className="size-3" aria-hidden />
            Needs a decision
          </Badge>
        )}
      </div>

      <div className="flex flex-col gap-2.5 px-2.5 pb-2.5">
        {retired && (
          <p className="rounded-md bg-muted px-3 py-2 text-xs leading-[18px] text-muted-foreground">
            {subteam.name} stays as it is this term. Its VPs become alum when leadership is
            locked or the change is applied; its execs become alum at Finalize unless
            they&apos;re hired onto another subteam.
          </p>
        )}
        {!retired && seats.length === 0 && (
          <p className="rounded-md border border-dashed px-3 py-4 text-center text-xs text-muted-foreground">
            No VP yet. Add one or open the seat to the public.
          </p>
        )}
        {seats.map(({ position, slots: seatSlots }) => (
          <div key={position.id} className="rounded-md border bg-card">
            <div className="border-b px-3 py-2 text-xs font-medium text-muted-foreground">
              {position.name}
              {seatSlots.length > 1 ? " · shared by co-VPs" : ""}
            </div>
            {seatSlots.map((slot) => (
              <SlotRow
                key={slot.id}
                slot={slot}
                subteam={subteam}
                retired={retired}
                editor={editor}
              />
            ))}
          </div>
        ))}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {!retired ? (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              disabled={editor.disabled}
              onClick={() => {
                const firstPosition = subteam.vpPositions[0];
                if (firstPosition) editor.addVp(firstPosition.id);
              }}
            >
              <Plus aria-hidden />
              Add VP seat
            </Button>
          ) : (
            <span />
          )}
          {editor.canEditStructure && (
            <div className="flex items-center gap-2 px-1">
              <Label htmlFor={switchId} className="text-xs font-normal text-muted-foreground">
                Not continuing next term
              </Label>
              <Switch
                id={switchId}
                checked={retired}
                disabled={editor.disabled || blocker !== null}
                onCheckedChange={(on) => editor.setRetired(subteam.id, on)}
              />
            </div>
          )}
        </div>
        {blocker && <p className="px-1 text-xs text-muted-foreground">{blocker}</p>}
      </div>
    </div>
  );
}

function SlotRow({
  slot,
  subteam,
  retired,
  editor,
}: {
  readonly slot: LeadershipSlot;
  readonly subteam: Subteam;
  readonly retired: boolean;
  readonly editor: SlotEditor;
}) {
  const { people, subteamNames, seatedIds, disabled } = editor;
  const outgoing = slot.outgoingProfileId ? people[slot.outgoingProfileId] : undefined;
  const successor = slot.successorProfileId ? people[slot.successorProfileId] : undefined;
  const isNew = !slot.outgoingProfileId;

  const decisions: SlotDecision[] =
    isNew || retired
      ? slotDecisionOptions(slot, { retired })
      : [...slotDecisionOptions(slot), "undecided"];
  const options = decisions.map((value) => ({
    value,
    label: isNew && value === "successor" ? "Appoint" : SLOT_DECISION_LABELS[value],
  }));
  const positionName = subteam.vpPositions.find((p) => p.id === slot.positionId)?.name ?? "VP";

  if (slot.decision === "hired") {
    return (
      <HiredSlotRow
        outgoingName={outgoing?.name ?? null}
        hireName={successor?.name ?? "A public applicant"}
        positionName={positionName}
      />
    );
  }

  return (
    <div className="border-b p-3 last:border-b-0">
      <div className="flex items-center gap-2.5">
        <PersonAvatar name={outgoing?.name ?? "New seat"} className="size-7.5 text-[11px]" />
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold">{outgoing?.name ?? "New seat"}</div>
          <div className="text-xs text-muted-foreground">
            {outgoing ? `Now: ${personNow(outgoing, subteamNames)}` : "Not held by anyone now"}
          </div>
        </div>
        {isNew && (
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label="Remove this seat"
            disabled={disabled}
            onClick={() => editor.remove(slot.id)}
          >
            <Trash2 className="size-4" aria-hidden />
          </Button>
        )}
      </div>

      {subteam.vpPositions.length > 1 && !retired && (
        <Select
          value={String(slot.positionId)}
          disabled={disabled}
          onValueChange={(value) => editor.update(slot.id, { positionId: Number(value) })}
        >
          <SelectTrigger size="sm" className="mt-2.5 w-full min-w-0" aria-label="VP position">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {subteam.vpPositions.map((position) => (
              <SelectItem key={position.id} value={String(position.id)}>
                {position.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <SeatDecision
        label={`${outgoing?.name ?? "New seat"} status`}
        className="mt-2.5"
        value={slot.decision}
        options={options}
        disabled={disabled || retired}
        onChange={(decision) =>
          editor.update(slot.id, {
            decision,
            successorProfileId: decision === "successor" ? slot.successorProfileId : null,
          })
        }
      />

      {slot.decision === "successor" && (
        <div className="mt-2.5 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-2">
          <span className="text-xs text-muted-foreground">{isNew ? "VP" : "Successor"}</span>
          <PersonPicker
            label={`${positionName} ${isNew ? "VP" : "successor"}`}
            placeholder="Pick someone"
            value={successor ?? null}
            disabled={disabled}
            excludeIds={seatedIds}
            onChange={(person) => editor.pick(slot.id, person)}
          />
        </div>
      )}

      {slot.decision === "open" && (
        <p className="mt-2.5 flex items-start gap-1.5 rounded-md bg-sky-500/10 px-2.5 py-1.5 text-xs text-sky-900 dark:text-sky-200">
          <Info className="mt-0.5 size-3.5 flex-none" aria-hidden />
          {positionName} is added to hiring positions. Presidents review those candidates.
        </p>
      )}
    </div>
  );
}

/** A public VP seat a candidate accepted. Locked here; it only changes through Offers. */
function HiredSlotRow({
  outgoingName,
  hireName,
  positionName,
}: {
  readonly outgoingName: string | null;
  readonly hireName: string;
  readonly positionName: string;
}) {
  return (
    <div className="border-b p-3 last:border-b-0">
      <div className="flex items-center gap-2.5">
        <PersonAvatar name={hireName} className="size-7.5 text-[11px]" />
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold">{hireName}</div>
          <div className="text-xs text-muted-foreground">
            {outgoingName ? `Replaces ${outgoingName} · ` : ""}
            {SLOT_DECISION_LABELS.hired}
          </div>
        </div>
        <Badge variant="secondary" className="gap-1">
          <Lock className="size-3" aria-hidden />
          Locked
        </Badge>
      </div>
      <p className="mt-2.5 flex items-start gap-1.5 rounded-md bg-muted px-2.5 py-1.5 text-xs text-muted-foreground">
        <Info className="mt-0.5 size-3.5 flex-none" aria-hidden />
        {hireName} accepted the {positionName} offer. To change this seat, correct their
        response in Offers.
      </p>
    </div>
  );
}
