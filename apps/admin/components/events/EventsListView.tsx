"use client";

import { format, parseISO } from "date-fns";
import { Pencil } from "lucide-react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@uwdsc/ui";
import type { Event } from "@uwdsc/common/types";
import { DeleteEventDialog } from "@/components/events";

interface EventsListViewProps {
  readonly events: Event[];
  readonly onEdit: (event: Event) => void;
  readonly onCreateClick: () => void;
  readonly onRefresh?: () => void;
}

export function EventsListView({
  events,
  onEdit,
  onCreateClick,
  onRefresh,
}: Readonly<EventsListViewProps>) {
  const formatDateTime = (iso: string) => {
    try {
      return format(parseISO(iso), "MMM d, yyyy h:mm a");
    } catch {
      return iso;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={onCreateClick}>Create event</Button>
      </div>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Start</TableHead>
              <TableHead>End</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
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
                      <DeleteEventDialog event={event} onSuccess={onRefresh} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
