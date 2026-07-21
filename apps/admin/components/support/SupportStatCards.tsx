"use client";

import { CalendarClock, Inbox, Mail, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@uwdsc/ui";
import type { TicketStats } from "@uwdsc/common/types";

interface SupportStatCardsProps {
  readonly stats: TicketStats;
}

export function SupportStatCards({ stats }: SupportStatCardsProps) {
  const cards = [
    {
      title: "Total tickets",
      value: stats.total,
      description: "All support submissions",
      icon: Inbox,
    },
    {
      title: "Contact form",
      value: stats.contactFormCount,
      description: "Submitted via the website form",
      icon: MessageSquare,
    },
    {
      title: "Email",
      value: stats.emailCount,
      description: "Sent to the support inbox",
      icon: Mail,
    },
    {
      title: "Last 7 days",
      value: stats.last7Days,
      description: "New tickets this week",
      icon: CalendarClock,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="gap-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
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
