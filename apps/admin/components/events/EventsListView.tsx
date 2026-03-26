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
import type { Event } from "@uwdsc/common/types";
import { formatDateTime } from "@/lib/utils/events";
import { DeleteEventDialog } from "@/components/events";

interface EventsListViewProps {
  readonly events: Event[];
  readonly onEdit: (event: Event) => void;
  readonly onRefresh?: () => void;
}

function EventCard({
  event,
  onEdit,
  onRefresh,
}: Readonly<{
  event: Event;
  onEdit: (event: Event) => void;
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
      </CardContent>
    </Card>
  );
}

export function EventsListView({
  events,
  onEdit,
  onRefresh,
}: Readonly<EventsListViewProps>) {
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
                <TableHead className="w-[100px] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
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
