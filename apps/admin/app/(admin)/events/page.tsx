"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { List, Calendar as CalendarIcon, Plus, Download } from "lucide-react";
import {
  Button,
  MonthlyEventCalendar,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uwdsc/ui";
import { getAllEventsWithAttendance, getAllTerms } from "@/lib/api";
import type { Event, EventWithAttendanceCount, Term } from "@uwdsc/common/types";
import { formatTermCode } from "@uwdsc/common/utils";
import {
  EventForm,
  EventsListView,
  EventDetailsDialog,
} from "@/components/events";
import { exportToCsv } from "@/lib/utils/csv";
import {
  getEventTerm,
  getEventCsvValue,
  EVENT_CSV_HEADERS,
} from "@/lib/utils/events";

type ViewMode = "list" | "calendar";

/** Filter events to those whose start_time falls within the given term's window. */
function filterEventsByTerm(
  events: EventWithAttendanceCount[],
  termId: string,
  terms: Term[],
): EventWithAttendanceCount[] {
  if (termId === "all") return events;
  if (termId === "other") {
    return events.filter((e) => getEventTerm(e, terms) === null);
  }
  const term = terms.find((t) => t.id === termId);
  if (!term) return events;
  const start = term.start_date ? Date.parse(term.start_date) : null;
  const end = Date.parse(term.end_date);
  if (start === null || Number.isNaN(end)) return events;
  return events.filter((e) => {
    const ms = Date.parse(e.start_time);
    return !Number.isNaN(ms) && ms >= start && ms <= end;
  });
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventWithAttendanceCount[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [selectedEvent, setSelectedEvent] =
    useState<EventWithAttendanceCount | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [selectedTermId, setSelectedTermId] = useState<string>("all");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [eventsData, termsData] = await Promise.all([
        getAllEventsWithAttendance(),
        getAllTerms(),
      ]);
      setEvents(eventsData);
      setTerms(termsData);
      const activeTerm = termsData.find((t) => t.is_active);
      if (activeTerm) setSelectedTermId(activeTerm.id);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError(err instanceof Error ? err.message : "Failed to load events");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredEvents = filterEventsByTerm(events, selectedTermId, terms);

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

  const handleExportCsv = useCallback(() => {
    exportToCsv(
      filteredEvents,
      {
        headers: [...EVENT_CSV_HEADERS],
        getValue: (row, key) => getEventCsvValue(row, key, terms),
      },
      `events-${new Date().toISOString().split("T")[0]}`,
    );
  }, [filteredEvents, terms]);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Events Portal</h1>
        <p className="text-muted-foreground">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Events Portal</h1>
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
          <h1 className="text-3xl font-bold">Events Portal</h1>
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

      {viewMode === "list" && (
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">
              Term
            </span>
            <Select value={selectedTermId} onValueChange={setSelectedTermId}>
              <SelectTrigger className="h-8 w-44">
                <SelectValue placeholder="Term" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Terms</SelectItem>
                {terms.map((term) => (
                  <SelectItem key={term.id} value={term.id}>
                    {formatTermCode(term.code)}
                  </SelectItem>
                ))}
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">
              &nbsp;
            </span>
            <Button onClick={handleExportCsv} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      )}

      {viewMode === "list" ? (
        <EventsListView
          events={filteredEvents}
          terms={terms}
          onEdit={handleEdit}
          onRefresh={fetchData}
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
        onDelete={fetchData}
      />

      <EventForm
        open={formOpen}
        onOpenChange={setFormOpen}
        event={editingEvent}
        onSuccess={fetchData}
      />
    </div>
  );
}
