"use client";

import { useCallback, useEffect, useState } from "react";
import type { SupportTicket, TicketFilters, TicketOverview } from "@uwdsc/common/types";
import { Skeleton } from "@uwdsc/ui";
import { getTicketOverview, getTickets } from "@/lib/api/tickets";
import { SupportFilters } from "./SupportFilters";
import { SupportStatCards } from "./SupportStatCards";
import { TicketsOverTimeChart } from "./TicketsOverTimeChart";
import { TicketsTable } from "./TicketsTable";

const DEFAULT_FILTERS: TicketFilters = {
  page: 1,
  pageSize: 20,
};

export function SupportDashboard() {
  const [filters, setFilters] = useState<TicketFilters>(DEFAULT_FILTERS);
  const [overview, setOverview] = useState<TicketOverview | null>(null);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [ticketsTotal, setTicketsTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (nextFilters: TicketFilters) => {
    setLoading(true);
    setError(null);

    try {
      const [overviewData, ticketsData] = await Promise.all([
        getTicketOverview(nextFilters),
        getTickets(nextFilters),
      ]);

      setOverview(overviewData);
      setTickets(ticketsData.tickets);
      setTicketsTotal(ticketsData.total);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => void loadData(filters), [filters, loadData]);

  const handleFiltersChange = (nextFilters: TicketFilters) => setFilters(nextFilters);

  const handlePageChange = (page: number) => setFilters((current) => ({ ...current, page }));

  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-3xl font-bold">Support</h1>
        <p className="text-muted-foreground">
          Contact form submissions and support emails in one place.
        </p>
      </div>

      <SupportFilters filters={filters} onChange={handleFiltersChange} />

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading && !overview ? (
        <DashboardSkeleton />
      ) : overview ? (
        <>
          <SupportStatCards stats={overview.stats} />

          <TicketsOverTimeChart data={overview.timeSeries} />

          <TicketsTable
            tickets={tickets}
            total={ticketsTotal}
            page={filters.page ?? 1}
            pageSize={filters.pageSize ?? 20}
            onPageChange={handlePageChange}
          />
        </>
      ) : null}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-28 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-80 rounded-xl" />
      <Skeleton className="h-72 rounded-xl" />
    </div>
  );
}
