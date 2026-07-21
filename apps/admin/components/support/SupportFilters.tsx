"use client";

import { type ReactNode, useEffect, useState } from "react";
import type { TicketFilters, TicketSource } from "@uwdsc/common/types";
import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uwdsc/ui";

interface SupportFiltersProps {
  readonly filters: TicketFilters;
  readonly onChange: (filters: TicketFilters) => void;
}

const SOURCES: { value: TicketSource; label: string }[] = [
  { value: "contact_form", label: "Contact form" },
  { value: "email", label: "Email" },
];

export function SupportFilters({ filters, onChange }: SupportFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search ?? "");

  useEffect(() => setSearchInput(filters.search ?? ""), [filters.search]);

  useEffect(() => {
    const trimmed = searchInput || undefined;
    if (trimmed === filters.search) return;

    const timeout = setTimeout(() => {
      onChange({ ...filters, search: trimmed, page: 1 });
    }, 300);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const update = (patch: Partial<TicketFilters>) => {
    onChange({ ...filters, ...patch, page: 1 });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <FilterField label="Source">
        <Select
          value={filters.source ?? "all"}
          onValueChange={(value) =>
            update({ source: value === "all" ? undefined : (value as TicketSource) })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All sources" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sources</SelectItem>
            {SOURCES.map((source) => (
              <SelectItem key={source.value} value={source.value}>
                {source.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterField>

      <FilterField label="Search">
        <Input
          placeholder="Search name, email, or subject"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
        />
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
