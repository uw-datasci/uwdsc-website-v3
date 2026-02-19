"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { List, Calendar as CalendarIcon, Plus } from "lucide-react";
import { Button, MonthlyEventCalendar } from "@uwdsc/ui";
import { getAllEvents } from "@/lib/api/events";
import type { Event } from "@uwdsc/common/types";
import {
  EventForm,
  EventsListView,
  EventDetailsDialog,
} from "@/components/events";

type ViewMode = "list" | "calendar";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllEvents();
      setEvents(data);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError(err instanceof Error ? err.message : "Failed to load events");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleEventClick = (event: { id: string }) => {
    const full = events.find((e) => e.id === event.id) ?? null;
    setSelectedEvent(full);
    setDetailsOpen(true);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormOpen(true);
  };

  const handleCreateClick = () => {
    setEditingEvent(null);
    setFormOpen(true);
  };

  const handleTodayClick = () => {
    setCurrentMonth(new Date());
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Nexus Terminal</h1>
        <p className="text-muted-foreground">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Nexus Terminal</h1>
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="p-4">
          <h1 className="text-3xl font-bold">Nexus Terminal</h1>
          <p className="text-muted-foreground">
            Create and manage club events.
          </p>
        </div>
        <div className="flex items-center gap-2 my-2">
          <Button variant="outline" size="icon" onClick={handleCreateClick}>
            <Plus className="size-4" />
          </Button>
          <div className="relative flex items-center rounded-full border p-1">
            <motion.div
              layoutId="view-mode-pill"
              className="absolute top-1 bottom-1 rounded-full bg-secondary"
              style={{
                width: "calc(50% - 4px)",
                left: viewMode === "list" ? 4 : "calc(50% + 2px)",
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              className="relative z-10 flex-1"
              onClick={() => setViewMode("list")}
            >
              <List className="mr-1.5 size-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="relative z-10 flex-1"
              onClick={() => setViewMode("calendar")}
            >
              <CalendarIcon className="ml-1.5 size-4" />
            </Button>
          </div>
        </div>
      </div>

      {viewMode === "list" ? (
        <EventsListView
          events={events}
          onEdit={handleEdit}
          onRefresh={fetchEvents}
        />
      ) : (
        <MonthlyEventCalendar
          events={events}
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
          onTodayClick={handleTodayClick}
          onEventClick={handleEventClick}
        />
      )}

      <EventDetailsDialog
        event={selectedEvent}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onEdit={handleEdit}
      />

      <EventForm
        open={formOpen}
        onOpenChange={setFormOpen}
        event={editingEvent}
        onSuccess={fetchEvents}
      />
    </div>
  );
}
