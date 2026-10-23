"use client";

import { useEffect, useState } from "react";
import { ChevronsUpDown, Search } from "lucide-react";
import type { LeadershipPerson } from "@uwdsc/common/types";
import { Button, Input, Popover, PopoverContent, PopoverTrigger, Spinner } from "@uwdsc/ui";
import { searchLeadershipPeople } from "@/lib/api";

interface PersonPickerProps {
  readonly value: LeadershipPerson | null;
  readonly onChange: (person: LeadershipPerson) => void;
  readonly label: string;
  readonly placeholder?: string;
  readonly disabled?: boolean;
  /** People who can't be picked (already seated elsewhere). */
  readonly excludeIds?: ReadonlySet<string>;
}

/** Search people by name, email or WatIAM and pick one. */
export function PersonPicker({
  value,
  onChange,
  label,
  placeholder = "Pick someone",
  disabled,
  excludeIds,
}: PersonPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LeadershipPerson[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return;

    let cancelled = false;
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const people = await searchLeadershipPeople(trimmed);
        if (!cancelled) setResults(people);
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setIsSearching(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const visible = query.trim().length < 2 ? [] : results;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          aria-label={label}
          className="h-8 w-full min-w-0 justify-between rounded-md font-normal"
        >
          <span className="truncate">
            {value ? (
              <>
                <span className="font-medium">{value.name}</span>
                {value.positionName && (
                  <span className="text-muted-foreground"> · {value.positionName}</span>
                )}
              </>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </span>
          <ChevronsUpDown className="size-3.5 opacity-60" aria-hidden />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 p-2">
        <div className="relative">
          <Search
            className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, email or WatIAM"
            aria-label="Search people"
            className="h-8 pl-8"
          />
        </div>
        <div className="mt-2 max-h-64 overflow-y-auto">
          {isSearching && (
            <div className="flex justify-center py-4">
              <Spinner className="size-4" />
            </div>
          )}
          {!isSearching && query.trim().length >= 2 && visible.length === 0 && (
            <p className="px-2 py-3 text-sm text-muted-foreground">No one found.</p>
          )}
          {!isSearching && query.trim().length < 2 && (
            <p className="px-2 py-3 text-sm text-muted-foreground">
              Type at least 2 characters.
            </p>
          )}
          <ul className="flex flex-col">
            {!isSearching &&
              visible.map((person) => {
                const taken = excludeIds?.has(person.id) ?? false;
                return (
                  <li key={person.id}>
                    <button
                      type="button"
                      disabled={taken}
                      onClick={() => {
                        onChange(person);
                        setOpen(false);
                        setQuery("");
                      }}
                      className="flex w-full flex-col items-start rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span className="font-medium">{person.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {person.email}
                        {person.positionName ? ` · ${person.positionName}` : ""}
                        {taken ? " · already seated" : ""}
                      </span>
                    </button>
                  </li>
                );
              })}
          </ul>
        </div>
      </PopoverContent>
    </Popover>
  );
}
