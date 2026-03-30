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
} from "@uwdsc/ui";
import { toast } from "sonner";
import { finalizeRoles } from "@/lib/api";
import type { NewExecTeamMember } from "@uwdsc/common/types";

interface FinalizeRolesDialogProps {
  readonly team: NewExecTeamMember[];
  readonly disabled?: boolean;
  readonly onFinalized: () => void;
}

export function FinalizeRolesDialog({
  team,
  disabled,
  onFinalized,
}: FinalizeRolesDialogProps) {
  const [open, setOpen] = useState(false);
  const [finalizing, setFinalizing] = useState(false);

  const adminCount = team.filter((m) => m.computed_role === "admin").length;
  const execCount = team.filter((m) => m.computed_role === "exec").length;

  const handleFinalize = async () => {
    try {
      setFinalizing(true);
      const { summary } = await finalizeRoles();
      toast.success(
        `Roles finalized: ${summary.promoted_to_admin} admin, ${summary.promoted_to_exec} exec, ${summary.demoted_to_member} demoted to member`,
      );
      setOpen(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
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

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={finalizing}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleFinalize}
            disabled={finalizing}
          >
            {finalizing ? "Finalizing..." : "Confirm Finalize"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
