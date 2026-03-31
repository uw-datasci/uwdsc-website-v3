"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uwdsc/ui";
import { Search } from "lucide-react";
import type {
  ApplicationListItem,
  ApplicationReviewStatus,
} from "@uwdsc/common/types";
import {
  ALL_STATUS_FILTER,
  ApplicationReviewStatusFilter,
  REVIEW_STATUS_LIST,
} from "@/constants/applications";

interface ReviewHeaderProps {
  readonly applications: ApplicationListItem[];
  readonly scopeText: string;
  readonly onFilteredApplicationsChange: (
    filtered: ApplicationListItem[],
  ) => void;
}

export function ReviewHeader({
  applications,
  scopeText,
  onFilteredApplicationsChange,
}: ReviewHeaderProps) {
  const [statusFilter, setStatusFilter] =
    useState<ApplicationReviewStatusFilter>(ALL_STATUS_FILTER);
  const [nameSearch, setNameSearch] = useState("");

  const filteredApplications = useMemo(() => {
    const query = nameSearch.trim().toLowerCase();
    return applications.filter((app) => {
      const matchesName = !query || app.full_name.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === ALL_STATUS_FILTER ||
        app.position_selections.some((sel) => sel.status === statusFilter);
      return matchesName && matchesStatus;
    });
  }, [applications, nameSearch, statusFilter]);

  useEffect(() => {
    onFilteredApplicationsChange(filteredApplications);
  }, [filteredApplications, onFilteredApplicationsChange]);

  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="mb-1 text-3xl font-bold">Applications Review</h1>
        <p className="text-sm text-muted-foreground">
          {filteredApplications.length} application
          {filteredApplications.length === 1 ? "" : "s"} for the {scopeText}{" "}
          team
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">
            Search
          </span>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name..."
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              className="h-8 w-52 pl-8"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">
            Status
          </span>
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              if (value === ALL_STATUS_FILTER) {
                setStatusFilter(ALL_STATUS_FILTER);
                return;
              }
              if (
                REVIEW_STATUS_LIST.includes(value as ApplicationReviewStatus)
              ) {
                setStatusFilter(value as ApplicationReviewStatus);
              }
            }}
          >
            <SelectTrigger className="h-8 w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_STATUS_FILTER}>All</SelectItem>
              {REVIEW_STATUS_LIST.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
