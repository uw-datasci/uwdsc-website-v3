"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
  Switch,
} from "@uwdsc/ui";
import { createPosition } from "@/lib/api";

export interface CreatePositionTarget {
  subteams: { id: number; name: string }[];
  subteamId: number | null;
  allowVp: boolean;
  openInCycle: boolean;
}

/**
 * New position on a subteam. From Leadership the subteam is fixed and it can be a VP
 * position; from Setup it's an exec position opened in the cycle right away.
 */
export function CreatePositionDialog({
  target,
  onClose,
  onCreated,
}: {
  readonly target: CreatePositionTarget | null;
  readonly onClose: () => void;
  readonly onCreated: (position: { positionId: number; isVp: boolean }) => Promise<void>;
}) {
  return (
    <Dialog open={target !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-md">
        {target && (
          <CreatePositionForm target={target} onClose={onClose} onCreated={onCreated} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function CreatePositionForm({
  target,
  onClose,
  onCreated,
}: {
  readonly target: CreatePositionTarget;
  readonly onClose: () => void;
  readonly onCreated: (position: { positionId: number; isVp: boolean }) => Promise<void>;
}) {
  const [subteamId, setSubteamId] = useState<number | null>(
    target.subteamId ?? (target.subteams.length === 1 ? (target.subteams[0]?.id ?? null) : null)
  );
  const [name, setName] = useState("");
  const [isVp, setIsVp] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fixedSubteam =
    target.subteamId === null
      ? null
      : (target.subteams.find((subteam) => subteam.id === target.subteamId) ?? null);
  const valid = subteamId !== null && name.trim().length >= 2;

  const submit = async () => {
    if (subteamId === null) return;
    setSaving(true);
    setError(null);
    try {
      const { positionId } = await createPosition({
        subteamId,
        name: name.trim(),
        isVp,
        openInCycle: target.openInCycle,
      });
      toast.success(`${name.trim()} created`);
      await onCreated({ positionId, isVp });
      onClose();
    } catch (err) {
      setError((err as Error).message || "Couldn't create the position");
      setSaving(false);
    }
  };

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (valid && !saving) void submit();
      }}
    >
      <DialogHeader>
        <DialogTitle>
          {fixedSubteam ? `New position in ${fixedSubteam.name}` : "New position"}
        </DialogTitle>
        <DialogDescription>
          {target.openInCycle
            ? "It opens for applications in this cycle straight away."
            : "Exec positions are ticked for hiring with 1 opening. Change it in Hiring positions."}
        </DialogDescription>
      </DialogHeader>

      {!fixedSubteam && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="position-subteam">Subteam</Label>
          <Select
            value={subteamId === null ? undefined : String(subteamId)}
            onValueChange={(value) => setSubteamId(Number(value))}
          >
            <SelectTrigger id="position-subteam" className="w-full">
              <SelectValue placeholder="Pick a subteam" />
            </SelectTrigger>
            <SelectContent>
              {target.subteams.map((subteam) => (
                <SelectItem key={subteam.id} value={String(subteam.id)}>
                  {subteam.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="position-name">Position name</Label>
        <Input
          id="position-name"
          autoFocus
          value={name}
          maxLength={60}
          placeholder={isVp ? "e.g. VP of Research" : "e.g. Research Analyst"}
          onChange={(event) => setName(event.target.value)}
        />
      </div>

      {target.allowVp && (
        <div className="flex items-start justify-between gap-4 rounded-md border p-3">
          <div>
            <Label htmlFor="position-vp">VP position</Label>
            <p className="mt-0.5 text-xs text-muted-foreground">
              A second VP seat on this subteam. Fill it from Vice presidents.
            </p>
          </div>
          <Switch id="position-vp" checked={isVp} onCheckedChange={setIsVp} />
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <DialogFooter className="gap-2">
        <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" disabled={!valid || saving}>
          {saving && <Spinner className="size-4" />}
          Create position
        </Button>
      </DialogFooter>
    </form>
  );
}
