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
} from "@uwdsc/ui";
import { deleteEvent } from "@/lib/api/events";
import type { Event } from "@uwdsc/common/types";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

interface DeleteEventDialogProps {
  readonly event: Event;
  readonly onConfirm?: () => void;
  readonly onSuccess?: () => void;
}

export function DeleteEventDialog({
  event,
  onConfirm,
  onSuccess,
}: Readonly<DeleteEventDialogProps>) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteEvent(event.id);
      toast.success("Event deleted successfully");
      setOpen(false);
      onConfirm?.();
      onSuccess?.();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete event";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        aria-label="Delete event"
      >
        <Trash2 className="size-4 text-destructive" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{event.name}</span>? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
