import { CalendarPlus, Clock, MapPin, Timer } from "lucide-react";
import { Button } from "@uwdsc/ui";
import type { Event } from "@uwdsc/common/types";
import { formatDateTime, getGoogleCalendarUrl } from "@/lib/utils/events";

interface NoEventStateProps {
  readonly nextEvent: Event | null;
}

export function NoEventState({ nextEvent }: NoEventStateProps) {
  return (
    <main className="flex flex-col items-center justify-center px-4 text-center">
      <div className="rounded-2xl border bg-card p-8 max-w-md w-full shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Clock className="size-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Stay Tuned!</h1>
        <p className="text-muted-foreground mb-6">
          No events are active for check-in right now. Check back when an event
          is about to start.
        </p>

        {nextEvent && (
          <div className="rounded-lg border bg-muted/30 p-4 text-left text-sm space-y-3">
            <p className="font-semibold text-base">{nextEvent.name}</p>
            <p className="text-muted-foreground text-xs whitespace-pre-wrap line-clamp-2">
              {nextEvent.description}
            </p>
            <div className="space-y-1.5">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="size-3.5 shrink-0 text-sky-500" />
                {formatDateTime(nextEvent.start_time)}
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Timer className="size-3.5 shrink-0 text-amber-500" />
                {formatDateTime(nextEvent.end_time)}
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="size-3.5 shrink-0 text-emerald-500" />
                {nextEvent.location}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={() => {
                const url = getGoogleCalendarUrl(nextEvent);
                window.open(url, "_blank", "noopener,noreferrer");
              }}
            >
              <CalendarPlus className="mr-1.5 size-4" />
              Add to Calendar
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
