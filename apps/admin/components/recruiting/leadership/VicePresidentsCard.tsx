"use client";

import { AlertCircle, Info, Plus, Trash2 } from "lucide-react";
import { SLOT_DECISION_LABELS, type SlotDecision } from "@uwdsc/common/constants";
import { slotDecisionOptions, slotNextHolder } from "@uwdsc/common/recruiting";
import type { LeadershipSlot } from "@uwdsc/common/schemas";
import type { LeadershipStructure } from "@uwdsc/common/types";
import {
  Badge,
  Button,
  Card,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uwdsc/ui";
import { PersonAvatar } from "./PersonAvatar";
import { personNow } from "@/lib/utils/recruiting";
import { PersonPicker } from "./PersonPicker";
import { SegmentedControl } from "./SegmentedControl";
import type { SlotEditor } from "@/types/recruiting";

type Subteam = LeadershipStructure["subteams"][number];

interface VicePresidentsCardProps {
  readonly structure: LeadershipStructure;
  readonly slots: LeadershipSlot[];
  readonly editor: SlotEditor;
}

export function VicePresidentsCard({ structure, slots, editor }: VicePresidentsCardProps) {
  return (
    <Card className="gap-0 py-0">
      <div className="border-b px-5 py-4">
        <h3 className="text-[15px] font-semibold">Vice presidents</h3>
        <p className="text-sm text-muted-foreground">
          Give every current VP a status. Co-VPs share a seat, and each still gets their own
          status.
        </p>
      </div>
      <div className="grid gap-4 p-5 md:grid-cols-2">
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
  const covered = slots.some(
    (slot) => slotNextHolder(slot) !== null || slot.decision === "open"
  );
  const needsDecision = !covered || slots.some((slot) => slot.decision === "undecided");
  const seats = subteam.vpPositions
    .map((position) => ({
      position,
      slots: slots.filter((slot) => slot.positionId === position.id),
    }))
    .filter((seat) => seat.slots.length > 0);

  return (
    <div className="rounded-lg border bg-muted/30">
      <div className="flex items-center gap-2 px-3.5 py-3">
        <h4 className="text-sm font-semibold">{subteam.name}</h4>
        <span className="text-xs text-muted-foreground">
          {seats.length === 1 ? "1 seat" : `${seats.length} seats`}
        </span>
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
        {seats.length === 0 && (
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
              <SlotRow key={slot.id} slot={slot} subteam={subteam} editor={editor} />
            ))}
          </div>
        ))}
        <Button
          variant="ghost"
          size="sm"
          className="self-start text-muted-foreground"
          disabled={editor.disabled}
          onClick={() => {
            const firstPosition = subteam.vpPositions[0];
            if (firstPosition) editor.addVp(firstPosition.id);
          }}
        >
          <Plus aria-hidden />
          Add VP seat
        </Button>
      </div>
    </div>
  );
}

function SlotRow({
  slot,
  subteam,
  editor,
}: {
  readonly slot: LeadershipSlot;
  readonly subteam: Subteam;
  readonly editor: SlotEditor;
}) {
  const { people, subteamNames, seatedIds, disabled } = editor;
  const outgoing = slot.outgoingProfileId ? people[slot.outgoingProfileId] : undefined;
  const successor = slot.successorProfileId ? people[slot.successorProfileId] : undefined;
  const isNew = !slot.outgoingProfileId;

  const decisions: SlotDecision[] = isNew
    ? slotDecisionOptions(slot)
    : [...slotDecisionOptions(slot), "undecided"];
  const options = decisions.map((value) => ({
    value,
    label: isNew && value === "successor" ? "Appoint" : SLOT_DECISION_LABELS[value],
  }));
  const positionName = subteam.vpPositions.find((p) => p.id === slot.positionId)?.name ?? "VP";

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

      {subteam.vpPositions.length > 1 && (
        <Select
          value={String(slot.positionId)}
          disabled={disabled}
          onValueChange={(value) => editor.update(slot.id, { positionId: Number(value) })}
        >
          <SelectTrigger size="sm" className="mt-2.5 w-full" aria-label="VP position">
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

      <SegmentedControl
        label={`${outgoing?.name ?? "New seat"} status`}
        className="mt-2.5"
        value={slot.decision}
        options={options}
        disabled={disabled}
        onChange={(decision) =>
          editor.update(slot.id, {
            decision,
            successorProfileId: decision === "successor" ? slot.successorProfileId : null,
          })
        }
      />

      {slot.decision === "successor" && (
        <div className="mt-2.5 flex items-center gap-2">
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
