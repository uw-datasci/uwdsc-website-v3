import type { Event, MembershipStatus } from "@uwdsc/common/types";
import { CheckInSuccess } from "./CheckInSuccess";
import { CheckInButton } from "./CheckInButton";

type ActiveEventSectionProps = {
  event: Event;
  membershipStatus: MembershipStatus | null;
  checkInSuccess: boolean;
  checkingIn: boolean;
  onCheckIn: () => void;
};

export function ActiveEventSection({
  event,
  membershipStatus,
  checkInSuccess,
  checkingIn,
  onCheckIn,
}: Readonly<ActiveEventSectionProps>) {
  return (
    <div className="space-y-3 sm:space-y-5">
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          </span>
          <p className="text-[10px] text-emerald-300 uppercase tracking-[0.2em] font-bold drop-shadow-sm">
            Happening Now
          </p>
        </div>
        <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] leading-tight line-clamp-2">
          {event.name}
        </h3>
      </div>

      {checkInSuccess ? (
        <CheckInSuccess />
      ) : (
        <CheckInButton
          hasMembership={membershipStatus?.has_membership ?? false}
          checkingIn={checkingIn}
          onCheckIn={onCheckIn}
        />
      )}
    </div>
  );
}
