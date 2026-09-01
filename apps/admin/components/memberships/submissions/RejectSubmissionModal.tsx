"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Textarea,
} from "@uwdsc/ui";

interface RejectSubmissionModalProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly memberName: string;
  readonly onConfirm: (reason: string) => Promise<void>;
}

export function RejectSubmissionModal({
  open,
  onOpenChange,
  memberName,
  onConfirm,
}: RejectSubmissionModalProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trimmed = reason.trim();

  const handleConfirm = async () => {
    if (!trimmed) return;
    setIsSubmitting(true);
    try {
      await onConfirm(trimmed);
      setReason("");
      onOpenChange(false);
    } catch {
      // onConfirm already surfaced a toast; keep the dialog open so the reason
      // isn't lost and the exec can retry.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setReason("");
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Reject submission</DialogTitle>
          <DialogDescription>
            {memberName} will see this reason and can edit and re-submit.
          </DialogDescription>
        </DialogHeader>

        <Textarea
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="e.g. The receipt is the WUSA order summary, not the Moneris payment receipt."
          className="min-h-28"
        />

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isSubmitting || !trimmed}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Rejecting…
              </>
            ) : (
              "Reject"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
