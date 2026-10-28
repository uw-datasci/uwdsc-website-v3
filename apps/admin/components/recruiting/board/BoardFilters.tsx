"use client";

import { MessageSquare, Search } from "lucide-react";
import type { BoardView } from "@uwdsc/common/types";
import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Toggle,
} from "@uwdsc/ui";
import { SOURCE_FILTERS } from "@/constants/recruiting";
import type { BoardFilters as Filters, BoardSource } from "@/types/recruiting";

const ALL = "all";

interface BoardFiltersProps {
  readonly board: BoardView;
  readonly filters: Filters;
  readonly onChange: (patch: Partial<Filters>) => void;
  readonly canFilterMine: boolean;
  readonly countText: string;
}

export function BoardFilters({
  board,
  filters,
  onChange,
  canFilterMine,
  countText,
}: BoardFiltersProps) {
  const positions = board.positions.filter(
    (position) => filters.subteamId === null || position.subteamId === filters.subteamId
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      {canFilterMine && (
        <div className="flex items-center gap-2 pr-1">
          <Switch
            id="board-mine"
            checked={filters.mine}
            onCheckedChange={(mine) => onChange({ mine })}
          />
          <Label htmlFor="board-mine" className="text-sm font-medium">
            My positions
          </Label>
        </div>
      )}

      <Select
        value={filters.positionId === null ? ALL : String(filters.positionId)}
        onValueChange={(value) =>
          onChange({ positionId: value === ALL ? null : Number(value) })
        }
      >
        <SelectTrigger size="sm" className="w-48" aria-label="Position">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All positions</SelectItem>
          {positions.map((position) => (
            <SelectItem key={position.id} value={String(position.id)}>
              {position.subteamName ? `${position.subteamName} · ` : ""}
              {position.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.subteamId === null ? ALL : String(filters.subteamId)}
        onValueChange={(value) =>
          onChange({ subteamId: value === ALL ? null : Number(value), positionId: null })
        }
      >
        <SelectTrigger size="sm" className="w-40" aria-label="Subteam">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All subteams</SelectItem>
          {board.subteams.map((subteam) => (
            <SelectItem key={subteam.id} value={String(subteam.id)}>
              {subteam.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.source}
        onValueChange={(source) => onChange({ source: source as BoardSource })}
      >
        <SelectTrigger size="sm" className="w-36" aria-label="Source">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SOURCE_FILTERS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Toggle
        size="sm"
        variant="outline"
        pressed={filters.hasNotes}
        onPressedChange={(hasNotes) => onChange({ hasNotes })}
        aria-label="Only candidates with notes"
      >
        <MessageSquare aria-hidden />
        Has notes
      </Toggle>

      <div className="relative w-64">
        <Search
          className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          value={filters.search}
          onChange={(event) => onChange({ search: event.target.value })}
          placeholder="Search name, program or email"
          aria-label="Search candidates"
          className="h-8 pl-8"
        />
      </div>

      <span className="ml-auto text-xs text-muted-foreground tabular-nums">{countText}</span>
    </div>
  );
}
