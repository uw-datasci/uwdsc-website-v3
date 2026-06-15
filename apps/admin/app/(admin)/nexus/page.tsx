"use client";

import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@uwdsc/ui";
import { getFeedSubscriberCount } from "@/lib/api/events";

export default function NexusPage() {
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    getFeedSubscriberCount()
      .then(setSubscriberCount)
      .catch(() => setError(true));
  }, []);

  return (
    <div className="mt-8 flex flex-col gap-4 max-w-5xl w-full">
      <h1 className="text-3xl font-bold tracking-tight">Nexus</h1>
      <p className="text-muted-foreground">
        Welcome to the Nexus developer portal. Here you can access all developer
        tools and configurations.
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">
              Calendar Subscribers
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {error ? "—" : (subscriberCount ?? "…")}
            </div>
            <p className="text-xs text-muted-foreground">
              Unique IPs in the last 30 days
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
