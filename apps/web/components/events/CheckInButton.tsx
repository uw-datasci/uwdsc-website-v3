"use client";

import { motion } from "framer-motion";
import { Button } from "@uwdsc/ui";

type CheckInButtonProps = {
  hasMembership: boolean;
  checkingIn: boolean;
  onCheckIn: () => void;
};

export function CheckInButton({
  hasMembership,
  checkingIn,
  onCheckIn,
}: Readonly<CheckInButtonProps>) {
  const buttonClassName = hasMembership
    ? "bg-white text-black hover:bg-gray-100 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
    : "bg-black/40 text-white/40 border-white/10 backdrop-blur-sm";

  let buttonLabel: React.ReactNode;
  if (checkingIn) {
    buttonLabel = (
      <span className="flex items-center justify-center gap-3">
        <span className="relative size-7 shrink-0 rounded-md border-2 border-black/70 bg-white/70">
          <span className="absolute inset-1 grid grid-cols-3 gap-[2px] opacity-40">
            <span className="rounded-xs bg-black/70" />
            <span className="rounded-xs bg-black/70" />
            <span className="rounded-xs bg-black/70" />
            <span className="rounded-xs bg-black/70" />
            <span className="rounded-xs bg-black/70" />
            <span className="rounded-xs bg-black/70" />
            <span className="rounded-xs bg-black/70" />
            <span className="rounded-xs bg-black/70" />
            <span className="rounded-xs bg-black/70" />
          </span>
          <motion.span
            className="absolute left-0.5 right-0.5 h-0.5 rounded-full bg-black/90"
            animate={{ y: [4, 20, 4] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
        SCANNING QR...
      </span>
    );
  } else if (hasMembership) {
    buttonLabel = "CHECK IN";
  } else {
    buttonLabel = "MEMBERSHIP REQUIRED";
  }

  return (
    <Button
      onClick={onCheckIn}
      disabled={!hasMembership || checkingIn}
      asChild
      className={`relative w-full h-12 sm:h-14 rounded-lg sm:rounded-xl font-black tracking-widest sm:tracking-[0.15em] overflow-hidden text-xs sm:text-sm ${buttonClassName}`}
    >
      <motion.button
        whileTap={hasMembership && !checkingIn ? { scale: 0.98 } : {}}
      >
        <div className="relative z-10 flex items-center justify-center">
          {buttonLabel}
        </div>
      </motion.button>
    </Button>
  );
}
