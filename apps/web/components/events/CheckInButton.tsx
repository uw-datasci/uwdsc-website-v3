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
        <div className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
        CHECKING IN...
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
