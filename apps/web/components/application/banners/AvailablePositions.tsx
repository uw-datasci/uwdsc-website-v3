import { motion } from "framer-motion";
import { LinkIcon } from "lucide-react";
import Link from "next/link";

export function AvailablePositions() {
  return (
    <Link
      href="https://uw-dsc.notion.site/join-dsc"
      target="_blank"
      className="mb-4 block mx-auto max-w-4xl"
    >
      <motion.div
        className="relative flex gap-4 overflow-hidden rounded-lg border border-solid border-blue-400/50 bg-blue-400/30 p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: 0,
          boxShadow: [
            "0 0 0 0 rgba(59, 130, 246, 0)",
            "0 0 0 4px rgba(59, 130, 246, 0.1)",
            "0 0 0 0 rgba(59, 130, 246, 0)",
          ],
        }}
        transition={{
          duration: 0.6,
          boxShadow: {
            duration: 3,
            repeat: Infinity,
            repeatDelay: 4,
          },
        }}
        whileHover={{
          scale: 1.02,
          boxShadow: "0 8px 25px rgba(59, 130, 246, 0.15)",
          transition: { duration: 0.2 },
        }}
      >
        {/* Shimmer overlay */}
        <motion.div
          className="absolute inset-0 -skew-x-12 bg-linear-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: "200%" }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 5,
            ease: "easeInOut",
          }}
        />

        <div className="mx-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-400/20">
          <LinkIcon className="h-4 w-4 text-blue-200" />
        </div>

        <div className="flex-1">
          <p className="font-semibold text-blue-200">Available Positions</p>
          <p className="text-sm text-blue-200/80">
            Check out all available positions, their skillsets, and where your
            strengths could make the biggest impact.
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
