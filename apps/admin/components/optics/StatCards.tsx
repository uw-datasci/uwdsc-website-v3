"use client";

import { AlertTriangle, AppWindow, Bug, CircleDot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@uwdsc/ui";
import type { RaftStats } from "@uwdsc/common/types";

interface StatCardsProps {
  readonly stats: RaftStats;
}

export function StatCards({ stats }: StatCardsProps) {
  const cards = [
    {
      title: "Total errors",
      value: stats.total_errors,
      description: "In selected time range",
      icon: Bug,
    },
    {
      title: "Open errors",
      value: stats.open_errors,
      description: "Awaiting triage",
      icon: CircleDot,
    },
    {
      title: "Critical errors",
      value: stats.critical_errors,
      description: "Error + fatal severity",
      icon: AlertTriangle,
    },
    {
      title: "Apps affected",
      value: stats.distinct_apps,
      description: "Distinct RAFT_APP_NAME values",
      icon: AppWindow,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
