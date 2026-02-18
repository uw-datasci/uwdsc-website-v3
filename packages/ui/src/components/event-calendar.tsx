"use client";

import * as React from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  parseISO,
  isWithinInterval,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@uwdsc/ui/lib/utils";
import { Button } from "./button";

/**
 * Minimal event shape for the calendar. Compatible with @uwdsc/common Event.
 */
export interface CalendarEvent {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  description?: string;
  location?: string;
  image_url?: string | null;
}

export interface MonthlyEventCalendarProps {
  readonly events: CalendarEvent[];
  readonly currentMonth: Date;
  readonly onMonthChange: (date: Date) => void;
  readonly onTodayClick: () => void;
  readonly onEventClick?: (event: CalendarEvent) => void;
  readonly renderEventContent?: (event: CalendarEvent) => React.ReactNode;
  readonly className?: string;
}

const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getEventsForDay(events: CalendarEvent[], day: Date): CalendarEvent[] {
  return events.filter((event) => {
    const start = parseISO(event.start_time);
    const end = parseISO(event.end_time);
    return (
      isSameDay(start, day) ||
      isSameDay(end, day) ||
      isWithinInterval(day, { start, end })
    );
  });
}

function formatEventTime(isoString: string): string {
  return format(parseISO(isoString), "h:mm a");
}

interface DayCellProps {
  readonly date: Date;
  readonly events: CalendarEvent[];
  readonly currentMonth: Date;
  readonly onEventClick?: (event: CalendarEvent) => void;
  readonly renderEventContent?: (event: CalendarEvent) => React.ReactNode;
  readonly formatEventTime: (isoString: string) => string;
}

function DayCell({
  date,
  events,
  currentMonth,
  onEventClick,
  renderEventContent,
  formatEventTime: formatTime,
}: DayCellProps) {
  const dayEvents = getEventsForDay(events, date);
  const isCurrentMonth = isSameMonth(date, currentMonth);
  return (
    <div
      className={cn(
        "min-h-[100px] bg-card p-1.5 text-sm",
        !isCurrentMonth && "bg-muted/30 text-muted-foreground",
      )}
    >
      <div
        className={cn(
          "mb-1 flex h-7 w-7 items-center justify-center rounded-full text-xs",
          isSameDay(date, new Date()) &&
            "bg-primary text-primary-foreground font-medium",
        )}
      >
        {format(date, "d")}
      </div>
      <div className="flex flex-col gap-1">
        {dayEvents.map((event) => (
          <button
            key={event.id}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEventClick?.(event);
            }}
            className={cn(
              "w-full truncate rounded border border-primary/20 bg-primary/10 px-1.5 py-0.5 text-left text-xs transition-colors hover:bg-primary/20",
              !onEventClick && "cursor-default",
            )}
          >
            {renderEventContent
              ? renderEventContent(event)
              : `${event.name} — ${formatTime(event.start_time)}`}
          </button>
        ))}
      </div>
    </div>
  );
}

export function MonthlyEventCalendar({
  events,
  currentMonth,
  onMonthChange,
  onTodayClick,
  onEventClick,
  renderEventContent,
  className,
}: MonthlyEventCalendarProps) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const weeks: Date[][] = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(day);
      day = addDays(day, 1);
    }
    weeks.push(week);
  }

  const handlePrevMonth = () => onMonthChange(subMonths(currentMonth, 1));
  const handleNextMonth = () => onMonthChange(addMonths(currentMonth, 1));

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handlePrevMonth}
            aria-label="Previous month"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleNextMonth}
            aria-label="Next month"
          >
            <ChevronRight className="size-4" />
          </Button>
          <h2 className="min-w-[180px] text-lg font-semibold">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onTodayClick}
        >
          Today
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="grid grid-cols-7 border-b bg-muted/50 text-center text-sm font-medium text-muted-foreground">
          {WEEKDAY_NAMES.map((name) => (
            <div key={name} className="border-r py-2 last:border-r-0">
              {name}
            </div>
          ))}
        </div>
        <div className="divide-y">
          {weeks.map((week, weekIndex) => (
            <div
              key={weekIndex}
              className="grid grid-cols-7 divide-x last:divide-y-0"
            >
              {week.map((date) => (
                <DayCell
                  key={date.toISOString()}
                  date={date}
                  events={events}
                  currentMonth={currentMonth}
                  onEventClick={onEventClick}
                  renderEventContent={renderEventContent}
                  formatEventTime={formatEventTime}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
