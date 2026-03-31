"use client";

import { Input } from "@uwdsc/ui";
import { Search } from "lucide-react";

interface HiringHeaderProps {
  readonly applicantCount: number;
  readonly nameSearch: string;
  readonly onNameSearchChange: (value: string) => void;
}

export function HiringHeader({
  applicantCount,
  nameSearch,
  onNameSearchChange,
}: HiringHeaderProps) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="mb-1 text-3xl font-bold">Hiring</h1>
        <p className="text-sm text-muted-foreground">
          {applicantCount} applicant{applicantCount === 1 ? "" : "s"}
        </p>
      </div>

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
    </div>
  );
}
