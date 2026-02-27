"use client";

import Image from "next/image";
import { CalendarPlus, Clock, MapPin, Timer } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@uwdsc/ui";
import type { Event } from "@uwdsc/common/types";
import {
  formatDateTime,
  getGoogleCalendarUrl,
  downloadICS,
} from "@/lib/utils/events";

interface EventDetailsDialogProps {
  readonly event: Event | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

export function EventDetailsDialog({
  event,
  open,
  onOpenChange,
}: Readonly<EventDetailsDialogProps>) {
  if (!event) return null;

  const handleAddToCalendar = () => {
    const url = getGoogleCalendarUrl(event);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDownloadICS = () => {
    downloadICS(event);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{event.name}</DialogTitle>
          {event.image_url ? (
            <div className="flex justify-center pt-1">
              <Image
                src={event.image_url}
                alt={event.name}
                width={240}
                height={135}
                className="object-cover"
              />
            </div>
          ) : null}
          {event.description ? (
            <p className="text-sm text-muted-foreground whitespace-pre-wrap pt-1">
              {event.description}
            </p>
          ) : null}
        </DialogHeader>
        <div className="flex gap-6 pt-2">
          <div className="flex min-w-0 flex-1 flex-col gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock className="size-4 shrink-0 text-sky-500" />
              {formatDateTime(event.start_time)}
            </span>
            <span className="flex items-center gap-1.5">
              <Timer className="size-4 shrink-0 text-amber-500" />
              {formatDateTime(event.end_time)}
            </span>
            {event.location ? (
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4 shrink-0 text-emerald-500" />
                {event.location}
              </span>
            ) : null}
          </div>
          <div className="flex shrink-0 flex-col gap-2">
            <Button variant="outline" size="sm" onClick={handleAddToCalendar}>
              <CalendarPlus className="mr-1.5 size-4" />
              Add to Calendar
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadICS}>
              <CalendarPlus className="mr-1.5 size-4" />
              Download .ics
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
