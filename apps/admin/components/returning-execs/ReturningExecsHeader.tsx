"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@uwdsc/ui";
import { Search } from "lucide-react";
import type { ReturningExecListItem } from "@uwdsc/common/types";

interface ReturningExecsHeaderProps {
  readonly submissions: ReturningExecListItem[];
  readonly onFilteredChange: (filtered: ReturningExecListItem[]) => void;
}

export function ReturningExecsHeader({
  submissions,
  onFilteredChange,
}: ReturningExecsHeaderProps) {
  const [positionFilter, setPositionFilter] = useState<string>("all");
  const [nameSearch, setNameSearch] = useState("");

  const positionOptions = useMemo(() => {
    const names = new Set<string>();
    for (const sub of submissions) {
      for (const sel of sub.position_selections) {
        names.add(sel.position_name);
      }
    }
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [submissions]);

  const filtered = useMemo(() => {
    const query = nameSearch.trim().toLowerCase();
    return submissions.filter((sub) => {
      const matchesPosition =
        positionFilter === "all" ||
        sub.position_selections.some(
          (sel) => sel.position_name === positionFilter,
        );
      const matchesName = !query || sub.full_name.toLowerCase().includes(query);
      return matchesPosition && matchesName;
    });
  }, [submissions, positionFilter, nameSearch]);

  useEffect(() => {
    onFilteredChange(filtered);
  }, [filtered, onFilteredChange]);

  return (
    <div className="mb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
      <div className="space-y-2 min-w-0 flex-1">
        <h1 className="text-3xl font-bold">Returning Execs</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="gap-1 px-2 py-1">
            <span className="text-muted-foreground">Total</span>
            <span className="font-semibold tabular-nums">{submissions.length}</span>
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {filtered.length} submission{filtered.length === 1 ? "" : "s"}
          {positionFilter !== "all" && (
            <span>
              {" "}for <span className="font-medium">{positionFilter}</span>
            </span>
          )}
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">Search</span>
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

        {positionOptions.length > 0 && (
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">Position</span>
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
