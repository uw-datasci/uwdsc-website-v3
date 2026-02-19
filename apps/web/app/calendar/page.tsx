"use client";

import { useEffect, useState, useCallback } from "react";
import { MonthlyEventCalendar } from "@uwdsc/ui";
import { getEvents } from "@/lib/api";
import type { Event } from "@uwdsc/common/types";
import { EventDetailsDialog } from "@/components/calendar";

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEvents();
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

  const handleTodayClick = () => {
    setCurrentMonth(new Date());
  };

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-3xl font-bold mb-4">Calendar</h1>
        <p className="text-muted-foreground">Loading events...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-3xl font-bold mb-4">Calendar</h1>
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 max-w-md">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center min-h-[60vh] w-full max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Calendar</h1>
      <p className="text-muted-foreground mb-6">
        Check out our events and workshops.
      </p>
      <div className="w-full">
        <MonthlyEventCalendar
          events={events}
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
          onTodayClick={handleTodayClick}
          onEventClick={handleEventClick}
          subscribeUrl="/api/events/feed"
        />
      </div>
      <EventDetailsDialog
        event={selectedEvent}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </main>
  );
}
