"use client";

import { motion } from "framer-motion";
import { Anvil, Zap } from "lucide-react";

export function FoundryHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col gap-3 mt-4"
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center size-10 rounded-lg bg-primary text-primary-foreground shrink-0">
          <Anvil className="size-5" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Foundry</h1>
      </div>

      <p className="text-muted-foreground leading-relaxed">
        The self-serve project onboarding engine for Nexus.
      </p>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Zap className="size-3 text-amber-500" />
        <span>Automated end-to-end setup via GitHub Actions</span>
      </div>
    </motion.div>
  );
}
