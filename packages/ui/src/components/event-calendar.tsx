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
import { CalendarPlus, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@uwdsc/ui/lib/utils";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import {
  GoogleCalendarIcon,
  AppleCalendarIcon,
  OutlookCalendarIcon,
} from "../icons";

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
  /** When set, shows a "Subscribe to calendar" button that copies the iCal feed URL so users can subscribe in their calendar app. */
  readonly subscribeUrl?: string;
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
  subscribeUrl,
  className,
}: MonthlyEventCalendarProps) {
  const [subscribeDialogOpen, setSubscribeDialogOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

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

  const fullFeedUrl =
    globalThis.window === undefined
      ? subscribeUrl ?? ""
      : (globalThis.window.location.origin ?? "") + (subscribeUrl ?? "");

  const handleCopyUrl = React.useCallback(() => {
    if (!fullFeedUrl) return;
    void navigator.clipboard.writeText(fullFeedUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [fullFeedUrl]);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onTodayClick}
          >
            Today
          </Button>
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
          <h2 className="min-w-[180px] text-2xl font-semibold ml-2">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
        </div>
        {subscribeUrl ? (
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSubscribeDialogOpen(true)}
            >
              <CalendarPlus className="mr-1.5 size-4" />
              Subscribe to calendar
            </Button>
            <Dialog
              open={subscribeDialogOpen}
              onOpenChange={setSubscribeDialogOpen}
            >
              <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Subscribe to calendar</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                  Copy the link below and add it to your calendar app to see
                  events and updates automatically.
                </p>
                <div className="flex gap-2">
                  <code className="flex-1 truncate rounded border bg-muted px-2 py-1.5 text-xs">
                    {fullFeedUrl}
                  </code>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopyUrl}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <Tabs defaultValue="google" className="w-full pt-2">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="google" className="gap-1.5">
                      <GoogleCalendarIcon className="size-4 shrink-0" />
                      Google
                    </TabsTrigger>
                    <TabsTrigger value="apple" className="gap-1.5">
                      <AppleCalendarIcon className="size-5 shrink-0 text-gray-700" />
                      Apple
                    </TabsTrigger>
                    <TabsTrigger value="outlook" className="gap-1.5">
                      <OutlookCalendarIcon className="size-4 shrink-0" />
                      Outlook
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="google" className="pt-3 text-sm">
                    <p className="mb-2 text-muted-foreground">
                      Add the calendar to Google Calendar using the link above:
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                      <li>Go to calendar.google.com</li>
                      <li>Click the &quot;+&quot; next to &quot;Other calendars&quot;</li>
                      <li>Choose &quot;From URL&quot;</li>
                      <li>Paste the link and click &quot;Add calendar&quot;</li>
                    </ol>
                  </TabsContent>
                  <TabsContent value="apple" className="pt-3 text-sm">
                    <p className="mb-2 text-muted-foreground">
                      Add the calendar to Apple Calendar using the link above:
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                      <li>Open the Calendar app</li>
                      <li>Go to File → New Calendar Subscription</li>
                      <li>Paste the link and click Subscribe</li>
                    </ol>
                  </TabsContent>
                  <TabsContent value="outlook" className="pt-3 text-sm">
                    <p className="mb-2 text-muted-foreground">
                      Add the calendar to Outlook using the link above:
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                      <li>Go to outlook.live.com/calendar or outlook.office.com/calendar</li>
                      <li>Click &quot;Add calendar&quot; → &quot;Subscribe from web&quot;</li>
                      <li>Paste the link and add the calendar</li>
                    </ol>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </>
        ) : null}
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
