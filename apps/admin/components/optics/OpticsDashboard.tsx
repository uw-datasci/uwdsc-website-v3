"use client";

import { useCallback, useEffect, useState } from "react";
import type { RaftErrorGroup, RaftGroupFilters, RaftOverview } from "@uwdsc/common/types";
import { Skeleton } from "@uwdsc/ui";
import { getRaftErrorGroups, getRaftOverview } from "@/lib/api/raft";
import { OpticsFilters } from "./OpticsFilters";
import { StatCards } from "./StatCards";
import { ErrorsOverTimeChart } from "./ErrorsOverTimeChart";
import { ErrorsByAppChart } from "./ErrorsByAppChart";
import { SeverityBreakdownChart } from "./SeverityBreakdownChart";
import { TopEndpointsChart } from "./TopEndpointsChart";
import { ErrorGroupsTable } from "./ErrorGroupsTable";

const DEFAULT_FILTERS: RaftGroupFilters = {
  timeRange: "7d",
  resolved: "all",
  page: 1,
  pageSize: 20,
};

export function OpticsDashboard() {
  const [filters, setFilters] = useState<RaftGroupFilters>(DEFAULT_FILTERS);
  const [overview, setOverview] = useState<RaftOverview | null>(null);
  const [groups, setGroups] = useState<RaftErrorGroup[]>([]);
  const [groupsTotal, setGroupsTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (nextFilters: RaftGroupFilters) => {
    setLoading(true);
    setError(null);

    try {
      const [overviewData, groupsData] = await Promise.all([
        getRaftOverview(nextFilters),
        getRaftErrorGroups(nextFilters),
      ]);

      setOverview(overviewData);
      setGroups(groupsData.groups);
      setGroupsTotal(groupsData.total);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => void loadData(filters), [filters, loadData]);

  const handleFiltersChange = (nextFilters: RaftGroupFilters) => setFilters(nextFilters);

  const handlePageChange = (page: number) => setFilters((current) => ({ ...current, page }));

  const handleResolvedChange = () => void loadData(filters);

  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-3xl font-bold">Nexus Optics</h1>
        <p className="text-muted-foreground">
          Raft error quarantine analytics and triage across UWDSC apps.
        </p>
      </div>

      <OpticsFilters
        filters={filters}
        apps={overview?.apps ?? []}
        environments={overview?.environments ?? []}
        onChange={handleFiltersChange}
      />

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading && !overview ? (
        <DashboardSkeleton />
      ) : overview ? (
        <>
          <StatCards stats={overview.stats} />

          <ErrorsOverTimeChart data={overview.timeSeries} />

          <div className="grid gap-4 lg:grid-cols-2">
            <ErrorsByAppChart data={overview.byApp} />
            <SeverityBreakdownChart data={overview.bySeverity} />
          </div>

          <TopEndpointsChart data={overview.topEndpoints} />

          <ErrorGroupsTable
            groups={groups}
            total={groupsTotal}
            page={filters.page ?? 1}
            pageSize={filters.pageSize ?? 20}
            filters={filters}
            onPageChange={handlePageChange}
            onResolvedChange={handleResolvedChange}
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
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
    </div>
  );
}
