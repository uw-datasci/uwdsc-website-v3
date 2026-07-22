import type { Event } from "@uwdsc/common/types";
import { motion } from "framer-motion";
import { CheckInSuccess } from "./CheckInSuccess";
import { CheckInButton } from "./CheckInButton";

type ActiveEventSectionProps = {
  event: Event;
  canCheckIn: boolean;
  checkInState: "idle" | "success" | "noStamp" | "error";
  checkInError: string | null;
  checkingIn: boolean;
  onCheckIn: () => void;
};

export function ActiveEventSection({
  event,
  canCheckIn,
  checkInState,
  checkInError,
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

      {checkInState === "success" ? (
        <CheckInSuccess />
      ) : (
        <div className="space-y-2">
          {checkInState === "noStamp" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-4 px-4 rounded-xl bg-amber-500/20 border border-amber-500/30"
            >
              <p className="text-amber-200 font-black tracking-[0.15em]">
                NO NEW STAMP
              </p>
              <p className="text-amber-100/80 text-xs mt-1.5 font-medium">
                You are already checked in
              </p>
            </motion.div>
          ) : null}

          {checkInState === "error" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-3 px-4 rounded-xl bg-red-500/20 border border-red-500/30"
            >
              <p className="text-red-200 font-black tracking-[0.15em]">
                SCAN FAILED
              </p>
              <p className="text-red-100/80 text-xs mt-1.5 font-medium text-center">
                {checkInError ?? "Please try scanning again"}
              </p>
            </motion.div>
          ) : null}

          <CheckInButton
            hasMembership={canCheckIn}
            checkingIn={checkingIn}
            onCheckIn={onCheckIn}
          />
        </div>
      )}
    </div>
  );
}
