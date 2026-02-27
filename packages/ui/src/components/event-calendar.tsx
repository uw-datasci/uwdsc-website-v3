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
  max,
  min,
  differenceInCalendarDays,
  startOfDay,
} from "date-fns";
import { CalendarPlus, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
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

function formatEventTime(isoString: string): string {
  return format(parseISO(isoString), "h:mm a");
}

interface EventLayout {
  event: CalendarEvent;
  startIndex: number;
  span: number;
  lane: number;
}

function getWeekEventLayouts(
  week: Date[],
  events: CalendarEvent[],
): EventLayout[] {
  const ws = startOfDay(week[0] as Date);
  const we = startOfDay(week[6] as Date);

  const overlappingEvents = events.filter((event) => {
    const s = startOfDay(parseISO(event.start_time));
    const e = startOfDay(parseISO(event.end_time));
    return s <= we && e >= ws;
  });

  overlappingEvents.sort((a, b) => {
    const aS = startOfDay(parseISO(a.start_time)).getTime();
    const bS = startOfDay(parseISO(b.start_time)).getTime();
    if (aS !== bS) return aS - bS;

    const aE = startOfDay(parseISO(a.end_time)).getTime();
    const bE = startOfDay(parseISO(b.end_time)).getTime();
    return bE - bS - (aE - aS);
  });

  const layouts: EventLayout[] = [];
  const occupied: boolean[][] = [];

  for (const event of overlappingEvents) {
    const s = startOfDay(parseISO(event.start_time));
    const e = startOfDay(parseISO(event.end_time));

    const eventStart = max([s, ws]);
    const eventEnd = min([e, we]);

    const startIndex = differenceInCalendarDays(eventStart, ws);
    const endIndex = differenceInCalendarDays(eventEnd, ws);
    const span = endIndex - startIndex + 1;

    let lane = 0;
    while (true) {
      const currentLane = occupied[lane] || Array(7).fill(false);
      if (!occupied[lane]) occupied[lane] = currentLane;

      let canFit = true;
      for (let i = startIndex; i <= endIndex; i++) {
        if (currentLane[i]) {
          canFit = false;
          break;
        }
      }
      if (canFit) {
        for (let i = startIndex; i <= endIndex; i++) {
          currentLane[i] = true;
        }
        break;
      }
      lane++;
    }

    layouts.push({ event, startIndex, span, lane });
  }

  return layouts;
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
      ? (subscribeUrl ?? "")
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
          <h2 className="min-w-45 text-2xl font-semibold ml-2">
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
              <DialogContent className="sm:max-w-120 max-h-[90vh] overflow-y-auto">
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
                      <li>
                        Click the &quot;+&quot; next to &quot;Other
                        calendars&quot;
                      </li>
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
                      <li>
                        Go to outlook.live.com/calendar or
                        outlook.office.com/calendar
                      </li>
                      <li>
                        Click &quot;Add calendar&quot; → &quot;Subscribe from
                        web&quot;
                      </li>
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
        <div className="divide-y relative">
          {weeks.map((week, weekIndex) => {
            const layouts = getWeekEventLayouts(week, events);
            return (
              <div key={weekIndex} className="relative min-h-24 md:min-h-32">
                {/* Background blocks */}
                <div className="absolute inset-0 grid grid-cols-7 divide-x pointer-events-none">
                  {week.map((date) => {
                    const isCurrentMonth = isSameMonth(date, currentMonth);
                    return (
                      <div
                        key={date.toISOString()}
                        className={cn(
                          "bg-card",
                          !isCurrentMonth && "bg-muted/30",
                        )}
                      />
                    );
                  })}
                </div>

                {/* Content grid */}
                <div className="relative z-10 grid grid-cols-7 auto-rows-max gap-y-1 pb-1">
                  {/* Row 1: Dates */}
                  {week.map((date, i) => {
                    const isToday = isSameDay(date, new Date());
                    const isCurrentMonth = isSameMonth(date, currentMonth);
                    return (
                      <div
                        key={`date-${i}`}
                        className={cn(
                          "col-span-1 flex justify-start p-1.5 pointer-events-none text-sm",
                          !isCurrentMonth && "text-muted-foreground",
                        )}
                        style={{ gridColumnStart: i + 1, gridRowStart: 1 }}
                      >
                        <div
                          className={cn(
                            "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs",
                            isToday &&
                              "bg-primary text-primary-foreground font-medium",
                          )}
                        >
                          {format(date, "d")}
                        </div>
                      </div>
                    );
                  })}

                  {/* Rows 2+: Events */}
                  {layouts.map((layout) => {
                    const { event, startIndex, span, lane } = layout;
                    const isMultiDay = !isSameDay(
                      parseISO(event.start_time),
                      parseISO(event.end_time),
                    );

                    return (
                      <div
                        key={event.id}
                        className="px-1 z-20"
                        style={{
                          gridColumnStart: startIndex + 1,
                          gridColumnEnd: `span ${span}`,
                          gridRowStart: lane + 2,
                        }}
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEventClick?.(event);
                          }}
                          className={cn(
                            "w-full flex flex-col items-start overflow-hidden rounded border border-primary/20 bg-primary/10 px-1.5 py-0.5 text-left transition-colors hover:bg-primary/20",
                            onEventClick ? "cursor-pointer" : "cursor-default",
                          )}
                          title={`${event.name} — ${formatEventTime(event.start_time)} to ${formatEventTime(event.end_time)}`}
                        >
                          {renderEventContent ? (
                            renderEventContent(event)
                          ) : (
                            <>
                              <span className="w-full truncate text-xs font-medium">
                                {event.name}
                              </span>
                              <span className="w-full truncate text-[10px] text-muted-foreground">
                                {isMultiDay
                                  ? `${format(parseISO(event.start_time), "MMM d, h:mm a")} - ${format(parseISO(event.end_time), "MMM d, h:mm a")}`
                                  : `${formatEventTime(event.start_time)} - ${formatEventTime(event.end_time)}`}
                              </span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
