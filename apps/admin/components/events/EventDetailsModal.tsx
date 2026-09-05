"use client";

import { Pencil, Clock, Timer, MapPin, ExternalLink } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@uwdsc/ui";
import type { Event } from "@uwdsc/common/types";
import { formatEventDescription } from "@uwdsc/common/utils";
import { formatDateTime } from "@/lib/utils/events";
import { DeleteEventDialog } from "./DeleteEventModal";
import { EventCategoryBadge } from "./EventCategoryBadge";

interface EventDetailsDialogProps {
  readonly event: Event | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onEdit: (event: Event) => void;
  readonly onDelete?: () => void;
}

export function EventDetailsDialog({
  event,
  open,
  onOpenChange,
  onEdit,
  onDelete,
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
          <DialogTitle className="flex items-center gap-2">
            {event.name}
            <EventCategoryBadge category={event.category} />
          </DialogTitle>
          <DialogDescription>Event schedule, location, and description.</DialogDescription>
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
            <span className="font-medium text-muted-foreground">Description:</span>
            <p className="whitespace-pre-wrap mt-1 text-muted-foreground">
              {formatEventDescription(event.description)}
            </p>
          </div>
        </div>
        {event.category === "workshop" && (
          <div className="text-sm">
            <span className="font-medium text-muted-foreground">Resources:</span>
            {event.resources.length === 0 ? (
              <p className="mt-1 text-muted-foreground">None added yet.</p>
            ) : (
              <ul className="mt-1 flex flex-col gap-1">
                {event.resources.map((resource) => (
                  <li key={resource.id}>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-primary hover:underline"
                    >
                      <ExternalLink className="size-3.5 shrink-0" />
                      {resource.source}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="ghost" size="icon" aria-label="Edit event" onClick={handleEdit}>
            <Pencil className="size-4" />
          </Button>

          <DeleteEventDialog
            event={event}
            onSuccess={() => {
              onOpenChange(false);
              onDelete?.();
            }}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
