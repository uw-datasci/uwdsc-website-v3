"use client";

import { format, parseISO } from "date-fns";
import { CalendarPlus, Bell } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@uwdsc/ui";
import type { Event } from "@uwdsc/common/types";

interface EventDetailsDialogProps {
  readonly event: Event | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

function formatDateTime(iso: string): string {
  try {
    return format(parseISO(iso), "MMM d, yyyy h:mm a");
  } catch {
    return iso;
  }
}

function toICSDate(iso: string): string {
  const d = new Date(iso);
  return d
    .toISOString()
    .replaceAll("-", "")
    .replaceAll(":", "")
    .replace(/\.\d{3}/, "");
}

function escapeICSText(text: string): string {
  return text
    .replaceAll("\\", "\\\\")
    .replaceAll(";", String.raw`\;`)
    .replaceAll(",", String.raw`\,`)
    .replaceAll("\n", String.raw`\n`);
}

function getGoogleCalendarUrl(event: Event): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.name,
    dates: `${toICSDate(event.start_time)}/${toICSDate(event.end_time)}`,
    details: event.description || "",
    location: event.location || "",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function downloadICS(event: Event): void {
  const start = toICSDate(event.start_time);
  const end = toICSDate(event.end_time);
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//UWDSC//Calendar//EN",
    "BEGIN:VEVENT",
    `UID:${event.id}@uwdsc`,
    `DTSTAMP:${start}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeICSText(event.name)}`,
    `DESCRIPTION:${escapeICSText(event.description || "")}`,
    `LOCATION:${escapeICSText(event.location || "")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${event.name.replaceAll(/[^a-z0-9]/gi, "_")}.ics`;
  a.click();
  URL.revokeObjectURL(url);
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
            <span className="font-medium text-muted-foreground">
              Description
            </span>
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
        <div className="flex flex-wrap gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={handleAddToCalendar}>
            <CalendarPlus className="mr-1.5 size-4" />
            Add to Google Calendar
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadICS}>
            <CalendarPlus className="mr-1.5 size-4" />
            Download .ics
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-block">
                  <Button variant="outline" size="sm" disabled>
                    <Bell className="mr-1.5 size-4" />
                    Subscribe to calendar
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>Coming soon</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
}
