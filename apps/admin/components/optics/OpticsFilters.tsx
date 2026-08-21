"use client";

import type { ReactNode } from "react";
import type {
  RaftGroupFilters,
  RaftResolvedFilter,
  RaftSeverity,
  RaftTimeRange,
} from "@uwdsc/common/types";
import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uwdsc/ui";

interface OpticsFiltersProps {
  readonly filters: RaftGroupFilters;
  readonly apps: string[];
  readonly environments: string[];
  readonly onChange: (filters: RaftGroupFilters) => void;
}

const TIME_RANGES: { value: RaftTimeRange; label: string }[] = [
  { value: "24h", label: "Last 24 hours" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
];

const RESOLVED_OPTIONS: { value: RaftResolvedFilter; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "open", label: "Open only" },
  { value: "resolved", label: "Resolved only" },
];

const SEVERITIES: RaftSeverity[] = ["fatal", "error", "warning", "info", "debug"];

export function OpticsFilters({ filters, apps, environments, onChange }: OpticsFiltersProps) {
  const update = (patch: Partial<RaftGroupFilters>) => {
    onChange({ ...filters, ...patch, page: 1 });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <FilterField label="App">
        <Select
          value={filters.appName ?? "all"}
          onValueChange={(value) => update({ appName: value === "all" ? undefined : value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="All apps" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All apps</SelectItem>
            {apps.map((app) => (
              <SelectItem key={app} value={app}>
                {app}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterField>

      <FilterField label="Environment">
        <Select
          value={filters.environment ?? "all"}
          onValueChange={(value) =>
            update({ environment: value === "all" ? undefined : value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All environments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All environments</SelectItem>
            {environments.map((env) => (
              <SelectItem key={env} value={env}>
                {env}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterField>

      <FilterField label="Severity">
        <Select
          value={filters.severity ?? "all"}
          onValueChange={(value) =>
            update({
              severity: value === "all" ? undefined : (value as RaftSeverity),
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All severities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All severities</SelectItem>
            {SEVERITIES.map((severity) => (
              <SelectItem key={severity} value={severity} className="capitalize">
                {severity}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterField>

      <FilterField label="Time range">
        <Select
          value={filters.timeRange ?? "7d"}
          onValueChange={(value) => update({ timeRange: value as RaftTimeRange })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIME_RANGES.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterField>

      <FilterField label="Status">
        <Select
          value={filters.resolved ?? "all"}
          onValueChange={(value) => update({ resolved: value as RaftResolvedFilter })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RESOLVED_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterField>
    </div>
  );
}

function FilterField({
  label,
  children,
}: {
  readonly label: string;
  readonly children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
