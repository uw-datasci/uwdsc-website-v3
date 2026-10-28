"use client";

import { Plus, Trash2 } from "lucide-react";
import type { LeadershipSlot } from "@uwdsc/common/schemas";
import type { LeadershipPerson } from "@uwdsc/common/types";
import { Badge, Button, Card } from "@uwdsc/ui";
import { PRESIDENT_DECISION_OPTIONS } from "@/constants/recruiting";
import { PersonAvatar } from "./PersonAvatar";
import { personNow } from "@/lib/utils/recruiting";
import { PersonPicker } from "./PersonPicker";
import { SegmentedControl } from "./SegmentedControl";
import type { SlotEditor } from "@/types/recruiting";

function nextTag(slot: LeadershipSlot): { label: string; className: string } {
  if (!slot.outgoingProfileId)
    return { label: "New President", className: "bg-primary/15 text-primary" };
  if (slot.decision === "continuing")
    return {
      label: "Stays President",
      className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
    };
  if (slot.decision === "leaving")
    return { label: "Becomes alum", className: "bg-muted text-foreground" };
  return {
    label: "Undecided",
    className: "bg-amber-500/15 text-amber-800 dark:text-amber-300",
  };
}

interface PresidentsCardProps {
  readonly slots: LeadershipSlot[];
  readonly editor: SlotEditor;
  readonly targetLabel: string;
}

export function PresidentsCard({ slots, editor, targetLabel }: PresidentsCardProps) {
  const { people, subteamNames, seatedIds, disabled } = editor;

  return (
    <Card className="gap-0 py-0">
      <div className="flex items-center gap-3 border-b px-5 py-4">
        <div className="flex-1">
          <h3 className="text-[15px] font-semibold">Presidents</h3>
          <p className="text-sm text-muted-foreground">Who leads {targetLabel}.</p>
        </div>
        <Button variant="outline" size="sm" disabled={disabled} onClick={editor.addPresident}>
          <Plus aria-hidden />
          Add president
        </Button>
      </div>
      <ul>
        {slots.map((slot) => {
          const outgoing = slot.outgoingProfileId ? people[slot.outgoingProfileId] : undefined;
          const successor = slot.successorProfileId
            ? people[slot.successorProfileId]
            : undefined;
          const tag = nextTag(slot);
          const name = outgoing?.name ?? successor?.name ?? "New president";

          return (
            <li
              key={slot.id}
              className="flex flex-wrap items-center gap-3.5 border-b px-5 py-3 last:border-b-0"
            >
              <PersonAvatar name={name} className="size-9 text-xs" />
              <div className="min-w-0 flex-[1_1_200px]">
                {outgoing ? (
                  <>
                    <div className="text-sm font-semibold">{outgoing.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Now: {personNow(outgoing, subteamNames)}
                    </div>
                  </>
                ) : (
                  <PersonPicker
                    label="New president"
                    placeholder="Pick the new president"
                    value={successor ?? null}
                    disabled={disabled}
                    excludeIds={seatedIds}
                    onChange={(person: LeadershipPerson) => editor.pick(slot.id, person)}
                  />
                )}
              </div>
              <Badge className={tag.className} variant="secondary">
                {tag.label}
              </Badge>
              {outgoing ? (
                <SegmentedControl
                  label={`${outgoing.name} next term`}
                  className="w-full sm:w-64"
                  value={slot.decision}
                  options={PRESIDENT_DECISION_OPTIONS}
                  disabled={disabled}
                  onChange={(decision) => editor.update(slot.id, { decision })}
                />
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Remove this president"
                  disabled={disabled}
                  onClick={() => editor.remove(slot.id)}
                >
                  <Trash2 className="size-4" aria-hidden />
                </Button>
              )}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
