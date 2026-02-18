"use client";

import { format, parseISO } from "date-fns";
import { Pencil } from "lucide-react";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle } from "@uwdsc/ui";
import type { Event } from "@uwdsc/common/types";

interface EventDetailsDialogProps {
  readonly event: Event | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onEdit: (event: Event) => void;
}

function formatDateTime(iso: string): string {
  try {
    return format(parseISO(iso), "MMM d, yyyy h:mm a");
  } catch {
    return iso;
  }
}

export function EventDetailsDialog({
  event,
  open,
  onOpenChange,
  onEdit,
}: Readonly<EventDetailsDialogProps>) {
  if (!event) return null;

  const handleEdit = () => {
    onOpenChange(false);
    onEdit(event);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="flex items-start justify-between gap-2">
            <DialogTitle className="pr-8">{event.name}</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEdit}
              aria-label="Edit event"
            >
              <Pencil className="size-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <div>
            <span className="font-medium text-muted-foreground">Start</span>
            <p>{formatDateTime(event.start_time)}</p>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">End</span>
            <p>{formatDateTime(event.end_time)}</p>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Location</span>
            <p>{event.location}</p>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Description</span>
            <p className="whitespace-pre-wrap">{event.description}</p>
          </div>
          {event.image_url && (
            <div>
              <span className="font-medium text-muted-foreground">Image</span>
              <a
                href={event.image_url}
                target="_blank"
                rel="noreferrer noopener"
                className="text-primary underline"
              >
                View image
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
