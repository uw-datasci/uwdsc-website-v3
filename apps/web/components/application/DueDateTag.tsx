import { motion } from "framer-motion";
import { ClockIcon } from "lucide-react";

interface DueDateTagProps {
  readonly deadline: Date;
}

export function DueDateTag({ deadline }: DueDateTagProps) {
  return (
    <div className="mx-auto mb-8 text-center">
      <motion.div
        className="inline-flex items-center rounded-full border border-yellow-400/40 bg-yellow-400/20 px-10 py-2 font-semibold text-yellow-400"
        animate={{
          boxShadow: [
            "0 0 20px rgba(250, 204, 21, 0.3), 0 0 40px rgba(250, 204, 21, 0.1)",
            "0 0 30px rgba(250, 204, 21, 0.5), 0 0 60px rgba(250, 204, 21, 0.2)",
            "0 0 20px rgba(250, 204, 21, 0.3), 0 0 40px rgba(250, 204, 21, 0.1)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <span className="mr-2 flex items-center">
          <ClockIcon className="h-4 w-4" />
        </span>
        {new Date(deadline).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }) || "Jul 30, 2025"}
      </motion.div>
    </div>
  );
}
