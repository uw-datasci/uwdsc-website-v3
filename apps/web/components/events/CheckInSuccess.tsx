import { motion } from "framer-motion";

export function CheckInSuccess() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-4 px-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]"
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </motion.div>
      <p className="text-emerald-300 font-black tracking-[0.15em] mt-3">
        CHECKED IN
      </p>
      <p className="text-emerald-400/80 text-xs mt-1.5 font-medium">
        Show this to an exec
      </p>
    </motion.div>
  );
}
