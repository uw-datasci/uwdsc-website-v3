import type { OverviewRoles, RoleSeat } from "@uwdsc/common/types";
import { cn } from "@uwdsc/ui";

function seatSlots(seat: RoleSeat): Array<"accepted" | "offer" | "open"> {
  const accepted = Math.min(seat.accepted, seat.openings);
  const offers = Math.min(seat.offers, seat.openings - accepted);
  return [
    ...Array<"accepted">(accepted).fill("accepted"),
    ...Array<"offer">(offers).fill("offer"),
    ...Array<"open">(Math.max(0, seat.openings - accepted - offers)).fill("open"),
  ];
}

const SLOT_CLASS = {
  accepted: "bg-emerald-500",
  offer: "bg-amber-400",
  open: "bg-muted ring-1 ring-border ring-inset",
} as const;

/** Seats per position: accepted, offer out, still open. */
export function RoleSeats({ roles }: { readonly roles: OverviewRoles }) {
  return (
    <section aria-labelledby="roles-h" className="flex flex-col rounded-lg border">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 border-b px-4 py-3">
        <h2 id="roles-h" className="text-sm font-semibold">
          {roles.title}
        </h2>
        <span className="text-xs text-muted-foreground tabular-nums">
          {roles.filled} of {roles.total} seats filled
        </span>
        <span className="ml-auto flex items-center gap-2.5 text-[11px] text-muted-foreground">
          {(["accepted", "offer", "open"] as const).map((slot) => (
            <span key={slot} className="flex items-center gap-1">
              <span aria-hidden className={cn("size-2 rounded-sm", SLOT_CLASS[slot])} />
              {{ accepted: "Accepted", offer: "Offer out", open: "Open" }[slot]}
            </span>
          ))}
        </span>
      </div>

      {roles.groups.length === 0 ? (
        <p className="px-4 py-6 text-center text-sm text-muted-foreground">
          No open positions yet. Presidents pick hiring positions in Leadership.
        </p>
      ) : (
        <div className="flex flex-col gap-4 px-4 py-3">
          {roles.groups.map((group) => (
            <div key={group.subteamName} className="flex flex-col gap-2">
              <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {group.subteamName}
              </h3>
              {group.seats.map((seat) => {
                const slots = seatSlots(seat);
                return (
                  <div
                    key={seat.positionId}
                    className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_auto] items-center gap-3"
                  >
                    <span className="truncate text-[13px]">{seat.name}</span>
                    <span
                      role="img"
                      aria-label={`${seat.accepted} accepted, ${seat.offers} offers out, ${seat.openings} seats`}
                      className="flex gap-1"
                    >
                      {slots.map((slot, i) => (
                        <span
                          key={i}
                          className={cn("h-2 flex-1 rounded-sm", SLOT_CLASS[slot])}
                        />
                      ))}
                    </span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {Math.min(seat.accepted, seat.openings)} of {seat.openings}
                      {seat.offers > 0 ? ` · ${seat.offers} out` : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {roles.others && (
        <p className="border-t px-4 py-2.5 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Other subteams · view only</span>{" "}
          {roles.others}
        </p>
      )}
    </section>
  );
}
