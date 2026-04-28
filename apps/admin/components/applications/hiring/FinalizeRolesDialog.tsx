"use client";

import { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  Input,
  Label,
} from "@uwdsc/ui";
import { toast } from "sonner";
import { finalizeRoles } from "@/lib/api";
import type { NewExecTeamMember } from "@uwdsc/common/types";

function isValidWhen2MeetLink(value: string): boolean {
  const v = value.trim();
  if (!v) return false;
  return v.startsWith("https://");
}

interface FinalizeRolesDialogProps {
  team: NewExecTeamMember[];
  disabled?: boolean;
  onFinalized: () => void;
}

export function FinalizeRolesDialog({
  team,
  disabled,
  onFinalized,
}: Readonly<FinalizeRolesDialogProps>) {
  const [open, setOpen] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [when2MeetLink, setWhen2MeetLink] = useState("");
  const [linkError, setLinkError] = useState("");

  const adminCount = team.filter((m) => m.computed_role === "admin").length;
  const execCount = team.filter((m) => m.computed_role === "exec").length;

  const resetForm = () => {
    setWhen2MeetLink("");
    setLinkError("");
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) resetForm();
  };

  const handleFinalize = async () => {
    const trimmed = when2MeetLink.trim();
    if (!isValidWhen2MeetLink(trimmed)) {
      setLinkError("Paste the full When2Meet URL (must start with https://).");
      return;
    }
    setLinkError("");

    try {
      setFinalizing(true);
      const { summary } = await finalizeRoles({ when2MeetLink: trimmed });
      toast.success(
        `Roles finalized: ${summary.promoted_to_admin} admin, ${summary.promoted_to_exec} exec, ${summary.demoted_to_member} demoted to member`,
      );
      setOpen(false);
      resetForm();
      onFinalized();
    } catch (err) {
      console.error("Error finalizing roles:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to finalize roles",
      );
    } finally {
      setFinalizing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button disabled={disabled || team.length === 0}>Finalize Team</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Finalize Team</DialogTitle>
          <DialogDescription>
            This will update user roles for the exec team for next term. This
            action affects all current exec and admin members.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 rounded-md bg-muted/50 p-4 text-sm">
          <p>
            <strong>{adminCount}</strong> member{adminCount === 1 ? "" : "s"}{" "}
            will be set to <strong>admin</strong> (Presidents & VPs)
          </p>
          <p>
            <strong>{execCount}</strong> member{execCount === 1 ? "" : "s"} will
            be set to <strong>exec</strong>
          </p>
          <p className="text-muted-foreground">
            All other current execs and admins will be demoted to{" "}
            <strong>member</strong>.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="when2meet-link" className="text-sm font-medium">
            All-hands When2Meet link
          </Label>
          <Input
            id="when2meet-link"
            type="url"
            inputMode="url"
            placeholder="https://when2meet.com/?..."
            value={when2MeetLink}
            disabled={finalizing}
            onChange={(e) => {
              setWhen2MeetLink(e.target.value);
              if (linkError) setLinkError("");
            }}
            autoComplete="off"
          />
          {linkError ? (
            <p className="text-sm text-destructive" role="alert">
              {linkError}
            </p>
          ) : null}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={finalizing}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleFinalize}
            disabled={finalizing || !when2MeetLink.trim()}
          >
            {finalizing ? "Finalizing..." : "Confirm Finalize"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
