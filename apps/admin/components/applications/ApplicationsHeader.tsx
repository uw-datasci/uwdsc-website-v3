"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uwdsc/ui";
import { Search } from "lucide-react";
import type { ApplicationListItem } from "@uwdsc/common/types";

interface ApplicationsHeaderProps {
  readonly applications: ApplicationListItem[];
  readonly statusCounts: {
    draft: number;
    submitted: number;
  };
  readonly onFilteredApplicationsChange: (
    filtered: ApplicationListItem[],
  ) => void;
}

export function ApplicationsHeader({
  applications,
  statusCounts,
  onFilteredApplicationsChange,
}: ApplicationsHeaderProps) {
  const [positionFilter, setPositionFilter] = useState<string>("all");
  const [nameSearch, setNameSearch] = useState("");

  const positionOptions = useMemo(() => {
    const names = new Set<string>();
    for (const app of applications) {
      for (const sel of app.position_selections) {
        names.add(sel.position_name);
      }
    }
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [applications]);

  const filteredApplications = useMemo(() => {
    const query = nameSearch.trim().toLowerCase();
    return applications.filter((app) => {
      const matchesPosition =
        positionFilter === "all" ||
        app.position_selections.some(
          (sel) => sel.position_name === positionFilter,
        );
      const matchesName = !query || app.full_name.toLowerCase().includes(query);
      return matchesPosition && matchesName;
    });
  }, [applications, positionFilter, nameSearch]);

  useEffect(() => {
    onFilteredApplicationsChange(filteredApplications);
  }, [filteredApplications, onFilteredApplicationsChange]);

  const totalApplications = statusCounts.draft + statusCounts.submitted;

  return (
    <div className="mb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
      <div className="space-y-4 min-w-0 flex-1">
        <h1 className="text-3xl font-bold">Applications</h1>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="gap-1 px-2 py-1">
            <span className="text-muted-foreground">Total Apps</span>
            <span className="font-semibold tabular-nums">
              {totalApplications}
            </span>
          </Badge>

          <Badge
            variant="secondary"
            className="gap-1 px-2 py-1 bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 dark:text-emerald-300 dark:bg-emerald-500/15 dark:border-emerald-500/30"
          >
            <span className="text-muted-foreground">Submitted</span>
            <span className="font-semibold tabular-nums">
              {statusCounts.submitted}
            </span>
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground">
          {filteredApplications.length} application
          {filteredApplications.length === 1 ? "" : "s"}
          {positionFilter !== "all" && (
            <span>
              {" "}
              for <span className="font-medium">{positionFilter}</span>
            </span>
          )}
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        {/* Name search */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">
            Search
          </span>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search by name…"
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              className="h-8 pl-8 w-52"
            />
          </div>
        </div>

        {/* Position filter */}
        {positionOptions.length > 0 && (
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">
              Position
            </span>
            <Select value={positionFilter} onValueChange={setPositionFilter}>
              <SelectTrigger className="h-8 w-48">
                <SelectValue placeholder="Filter by position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                {positionOptions.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
}
