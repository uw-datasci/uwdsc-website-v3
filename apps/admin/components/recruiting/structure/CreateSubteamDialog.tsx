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
  Spinner,
} from "@uwdsc/ui";
import { createSubteam } from "@/lib/api";

/** New subteam plus its VP position. The subteam then needs a VP or an open seat. */
export function CreateSubteamDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onCreated: () => Promise<void>;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-md">
        {open && (
          <CreateSubteamForm onClose={() => onOpenChange(false)} onCreated={onCreated} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function CreateSubteamForm({
  onClose,
  onCreated,
}: {
  readonly onClose: () => void;
  readonly onCreated: () => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [vpName, setVpName] = useState("");
  const [vpEdited, setVpEdited] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const vpPositionName = vpEdited ? vpName : name.trim() ? `VP of ${name.trim()}` : "";
  const valid = name.trim().length >= 2 && vpPositionName.trim().length >= 2;

  const submit = async () => {
    setSaving(true);
    setError(null);
    try {
      const result = await createSubteam({
        name: name.trim(),
        vpPositionName: vpPositionName.trim(),
      });
      toast.success(result.restored ? `${name.trim()} is back` : `${name.trim()} created`);
      await onCreated();
      onClose();
    } catch (err) {
      setError((err as Error).message || "Couldn't create the subteam");
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
        <DialogTitle>New subteam</DialogTitle>
        <DialogDescription>
          Next term&apos;s leadership will need a VP or an open seat for it before you lock or
          apply changes.
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="subteam-name">Subteam name</Label>
        <Input
          id="subteam-name"
          autoFocus
          value={name}
          maxLength={60}
          placeholder="e.g. Research"
          onChange={(event) => setName(event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="subteam-vp">VP position</Label>
        <Input
          id="subteam-vp"
          value={vpPositionName}
          maxLength={60}
          placeholder="VP of …"
          onChange={(event) => {
            setVpEdited(true);
            setVpName(event.target.value);
          }}
        />
        <p className="text-xs text-muted-foreground">
          Add exec positions from Hiring positions or Setup afterwards.
        </p>
      </div>

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
          Create subteam
        </Button>
      </DialogFooter>
    </form>
  );
}
