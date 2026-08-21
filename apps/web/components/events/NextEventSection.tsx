import type { Event } from "@uwdsc/common/types";

type NextEventSectionProps = {
  readonly nextEvent: Event | null;
};

export function NextEventSection({ nextEvent }: NextEventSectionProps) {
  return (
    <div className="bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-white/10 backdrop-blur-md shadow-inner min-w-0">
      <p className="text-[10px] text-white/50 uppercase tracking-[0.2em] mb-1.5 sm:mb-2 font-semibold">
        Next Up
      </p>
      {nextEvent ? (
        <>
          <h3 className="text-base sm:text-lg md:text-xl font-bold truncate text-white/90 drop-shadow-md">
            {nextEvent.name}
          </h3>
          <p className="text-xs sm:text-sm text-white/70 mt-2 sm:mt-3 flex items-center gap-2 font-medium bg-black/20 w-fit max-w-full px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-white/5">
            <svg
              className="w-4 h-4 text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {new Date(nextEvent.start_time).toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
        </>
      ) : (
        <p className="text-xs sm:text-sm text-white/70 font-medium">
          No upcoming events right now.
        </p>
      )}
    </div>
  );
}
