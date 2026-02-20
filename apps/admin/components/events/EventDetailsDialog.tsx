"use client";

import { Pencil, Clock, Timer, MapPin } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@uwdsc/ui";
import type { Event } from "@uwdsc/common/types";
import { formatDateTime } from "@/lib/utils/events";

interface EventDetailsDialogProps {
  readonly event: Event | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onEdit: (event: Event) => void;
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{event.name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-8 text-sm pt-4">
          <div className="flex flex-col gap-3 text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock className="size-4 shrink-0 text-sky-500" />
              {formatDateTime(event.start_time)}
            </span>
            <span className="flex items-center gap-1.5">
              <Timer className="size-4 shrink-0 text-amber-500" />
              {formatDateTime(event.end_time)}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4 shrink-0 text-emerald-500" />
              {event.location}
            </span>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">
              Description:
            </span>
            <p className="whitespace-pre-wrap mt-1 text-muted-foreground">
              {event.description}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Edit event"
            onClick={handleEdit}
          >
            <Pencil className="size-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
