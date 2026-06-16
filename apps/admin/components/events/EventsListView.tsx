"use client";

import { Pencil } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@uwdsc/ui";
import type { EventWithAttendanceCount, Term } from "@uwdsc/common/types";
import { formatDateTime, getEventTerm } from "@/lib/utils/events";
import { DeleteEventDialog } from "@/components/events";

interface EventsListViewProps {
  readonly events: EventWithAttendanceCount[];
  readonly terms: Term[];
  readonly onEdit: (event: EventWithAttendanceCount) => void;
  readonly onRefresh?: () => void;
}

function formatAttendance(
  event: EventWithAttendanceCount,
  terms: Term[],
): string | number {
  if (new Date(event.end_time) >= new Date()) return "—";
  if (event.attendance_count === 0 && getEventTerm(event, terms) === null)
    return "N/A";
  return event.attendance_count;
}

function EventCard({
  event,
  terms,
  onEdit,
  onRefresh,
}: Readonly<{
  event: EventWithAttendanceCount;
  terms: Term[];
  onEdit: (event: EventWithAttendanceCount) => void;
  onRefresh?: () => void;
}>) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight">{event.name}</h3>
          <div className="flex shrink-0 gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(event)}
              aria-label="Edit event"
            >
              <Pencil className="size-4" />
            </Button>
            <DeleteEventDialog event={event} onSuccess={onRefresh} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-1.5 pt-0 text-sm text-muted-foreground">
        <p>
          <span className="font-medium text-foreground">Start:</span>{" "}
          {formatDateTime(event.start_time)}
        </p>
        <p>
          <span className="font-medium text-foreground">End:</span>{" "}
          {formatDateTime(event.end_time)}
        </p>
        <p>
          <span className="font-medium text-foreground">Location:</span>{" "}
          {event.location}
        </p>
        {new Date(event.end_time) < new Date() && (
          <p>
            <span className="font-medium text-foreground">Attendance:</span>{" "}
            {formatAttendance(event, terms)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function EventsListView({
  events,
  terms,
  onEdit,
  onRefresh,
}: Readonly<EventsListViewProps>) {
  const now = new Date();
  return (
    <div className="space-y-4">
      {/* Mobile: card list */}
      <div className="space-y-3 md:hidden">
        {events.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
            No events yet. Create one to get started.
          </div>
        ) : (
          events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              terms={terms}
              onEdit={onEdit}
              onRefresh={onRefresh}
            />
          ))
        )}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block">
        <div className="rounded-lg border bg-card">
          <Table className="[&_th]:p-4 [&_td]:p-4">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead className="w-[100px] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground"
                  >
                    No events yet. Create one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.name}</TableCell>
                    <TableCell>{formatDateTime(event.start_time)}</TableCell>
                    <TableCell>{formatDateTime(event.end_time)}</TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatAttendance(event, terms)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(event)}
                          aria-label="Edit event"
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <DeleteEventDialog
                          event={event}
                          onSuccess={onRefresh}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
