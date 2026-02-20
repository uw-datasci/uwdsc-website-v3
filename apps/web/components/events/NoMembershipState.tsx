import { Clock, MapPin, QrCode } from "lucide-react";
import type { Event } from "@uwdsc/common/types";
import { formatDateTime } from "@/lib/utils/events";

interface NoMembershipStateProps {
  readonly nextEvent: Event | null;
}

export function NoMembershipState({ nextEvent }: NoMembershipStateProps) {
  return (
    <main className="flex flex-col items-center justify-center px-4 text-center">
      <div className="rounded-2xl border bg-card p-8 max-w-md w-full shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
          <QrCode className="size-8 text-amber-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Membership Required</h1>
        <p className="text-muted-foreground mb-6">
          You need an active membership to check in to events. Please pay your
          membership fee to get started.
        </p>
        {nextEvent && (
          <div className="rounded-lg border bg-muted/30 p-4 text-left text-sm space-y-2">
            <p className="font-medium text-base">{nextEvent.name}</p>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="size-3.5 shrink-0 text-sky-500" />
              {formatDateTime(nextEvent.start_time)}
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="size-3.5 shrink-0 text-emerald-500" />
              {nextEvent.location}
            </span>
          </div>
        )}
      </div>
    </main>
  );
}
