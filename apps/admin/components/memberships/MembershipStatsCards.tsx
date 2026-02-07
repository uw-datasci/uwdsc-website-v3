"use client";

import { useState } from "react";
import { Users, DollarSign, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { MembershipStats } from "@/types/api";
import type { MembershipFilterType } from "@/types/members";
import { cn, Card, CardHeader, CardTitle, CardContent } from "@uwdsc/ui";

interface MembershipStatsCardsProps {
  readonly stats: MembershipStats;
  readonly activeFilter: MembershipFilterType;
  readonly onFilterChange: (filter: MembershipFilterType) => void;
}

export function MembershipStatsCards({
  stats,
  activeFilter,
  onFilterChange,
}: MembershipStatsCardsProps) {
  const [hoveredCard, setHoveredCard] = useState<MembershipFilterType | null>(
    null,
  );

  const paidPercentage =
    stats.totalUsers > 0
      ? ((stats.paidUsers / stats.totalUsers) * 100).toFixed(1)
      : "0.0";

  const mathSocPercentage =
    stats.paidUsers > 0
      ? ((stats.mathSocMembers / stats.paidUsers) * 100).toFixed(1)
      : "0.0";

  const cardBaseStyles =
    "cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] relative overflow-hidden";
  const activeCardStyles = "ring-2 ring-primary";

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-8">
      {/* Total Users */}
      <Card
        className={cn(
          cardBaseStyles,
          activeFilter === "all" && activeCardStyles,
        )}
        onClick={() => onFilterChange("all")}
        onMouseEnter={() => setHoveredCard("all")}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
          <p className="text-xs text-muted-foreground">Registered members</p>
        </CardContent>
        <AnimatePresence>
          {hoveredCard === "all" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-2 left-0 right-0 flex justify-center pointer-events-none"
            >
              <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                Click to filter
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Paid Users */}
      <Card
        className={cn(
          cardBaseStyles,
          activeFilter === "paid" && activeCardStyles,
        )}
        onClick={() => onFilterChange("paid")}
        onMouseEnter={() => setHoveredCard("paid")}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Paid Members</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.paidUsers}</div>
          <p className="text-xs text-muted-foreground">
            {paidPercentage}% of total users
          </p>
        </CardContent>
        <AnimatePresence>
          {hoveredCard === "paid" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-2 left-0 right-0 flex justify-center pointer-events-none"
            >
              <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                Click to filter
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* MathSoc Members */}
      <Card
        className={cn(
          cardBaseStyles,
          activeFilter === "paid-mathsoc" && activeCardStyles,
        )}
        onClick={() => onFilterChange("paid-mathsoc")}
        onMouseEnter={() => setHoveredCard("paid-mathsoc")}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Paid MathSoc Members
          </CardTitle>
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.mathSocMembers}</div>
          <p className="text-xs text-muted-foreground">
            {mathSocPercentage}% of paid users
          </p>
        </CardContent>
        <AnimatePresence>
          {hoveredCard === "paid-mathsoc" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-2 left-0 right-0 flex justify-center pointer-events-none"
            >
              <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                Click to filter
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
