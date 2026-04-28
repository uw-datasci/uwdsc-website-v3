"use client";

import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uwdsc/ui";
import { Layers, Search } from "lucide-react";
import type { HiringSubteamOption } from "@/lib/utils/applications";

interface HiringHeaderProps {
  readonly applicantCount: number;
  readonly nameSearch: string;
  readonly onNameSearchChange: (value: string) => void;
  readonly subteamFilter: string;
  readonly onSubteamFilterChange: (value: string) => void;
  readonly subteamOptions: readonly HiringSubteamOption[];
}

export function HiringHeader({
  applicantCount,
  nameSearch,
  onNameSearchChange,
  subteamFilter,
  onSubteamFilterChange,
  subteamOptions,
}: HiringHeaderProps) {
  const showSubteamFilter = subteamOptions.length > 1;

  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="mb-1 text-3xl font-bold">Hiring</h1>
        <p className="text-sm text-muted-foreground">
          {applicantCount} applicant{applicantCount === 1 ? "" : "s"}
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">
            Search
          </span>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name..."
              value={nameSearch}
              onChange={(e) => onNameSearchChange(e.target.value)}
              className="h-8 w-52 pl-8"
            />
          </div>
        </div>

        {showSubteamFilter ? (
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">
              Subteam
            </span>
            <Select value={subteamFilter} onValueChange={onSubteamFilterChange}>
              <SelectTrigger size="sm" className="h-8 w-52 min-w-0">
                <Layers className="size-3.5 shrink-0 text-muted-foreground" />
                <SelectValue placeholder="Subteam" />
              </SelectTrigger>
              <SelectContent align="end" position="popper">
                {subteamOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}
      </div>
    </div>
  );
}
