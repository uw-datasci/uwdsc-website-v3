"use client";

import { ListFilter, MessageSquare, Search } from "lucide-react";
import type { BoardView } from "@uwdsc/common/types";
import {
  Button,
  cn,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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

type ControlProps = Pick<BoardFiltersProps, "board" | "filters" | "onChange">;

/** Filters above the board: one bar on desktop, a compact bar plus a sheet on phones. */
export function BoardFilters(props: BoardFiltersProps) {
  const { filters, onChange, canFilterMine, countText } = props;
  const active =
    Number(filters.positionId !== null) +
    Number(filters.subteamId !== null) +
    Number(filters.source !== "all") +
    Number(filters.hasNotes);

  return (
    <>
      <div className="hidden flex-wrap items-center gap-2 md:flex">
        {canFilterMine && <MineSwitch id="board-mine" filters={filters} onChange={onChange} />}
        <FilterControls {...props} layout="bar" />
        <SearchBox filters={filters} onChange={onChange} className="w-64" />
        <span className="ml-auto text-xs text-muted-foreground tabular-nums">{countText}</span>
      </div>

      <div className="flex flex-col gap-2 md:hidden">
        <div className="flex items-center gap-2">
          {canFilterMine && (
            <MineSwitch id="board-mine-mobile" filters={filters} onChange={onChange} />
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto">
                <ListFilter aria-hidden />
                Filters{active > 0 ? ` (${active})` : ""}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[85svh] gap-0 overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>{countText}</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-3 px-4">
                <FilterControls {...props} layout="sheet" />
              </div>
              <SheetFooter className="flex-row">
                <Button
                  variant="outline"
                  className="flex-1"
                  disabled={active === 0}
                  onClick={() =>
                    onChange({
                      positionId: null,
                      subteamId: null,
                      source: "all",
                      hasNotes: false,
                    })
                  }
                >
                  Clear filters
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
        <SearchBox filters={filters} onChange={onChange} className="w-full" />
        <span className="text-xs text-muted-foreground tabular-nums">{countText}</span>
      </div>
    </>
  );
}

function MineSwitch({
  id,
  filters,
  onChange,
}: Pick<ControlProps, "filters" | "onChange"> & { readonly id: string }) {
  return (
    <div className="flex items-center gap-2 pr-1" data-tour="my-positions">
      <Switch id={id} checked={filters.mine} onCheckedChange={(mine) => onChange({ mine })} />
      <Label htmlFor={id} className="text-sm font-medium">
        My positions
      </Label>
    </div>
  );
}

function SearchBox({
  filters,
  onChange,
  className,
}: Pick<ControlProps, "filters" | "onChange"> & { readonly className: string }) {
  return (
    <div className={cn("relative", className)}>
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
  );
}

function FilterControls({
  board,
  filters,
  onChange,
  layout,
}: ControlProps & { readonly layout: "bar" | "sheet" }) {
  const sheet = layout === "sheet";
  const positions = board.positions.filter(
    (position) => filters.subteamId === null || position.subteamId === filters.subteamId
  );

  return (
    <>
      <Select
        value={filters.positionId === null ? ALL : String(filters.positionId)}
        onValueChange={(value) =>
          onChange({ positionId: value === ALL ? null : Number(value) })
        }
      >
        <SelectTrigger
          size={sheet ? "default" : "sm"}
          className={sheet ? "w-full" : "w-48"}
          aria-label="Position"
        >
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
        <SelectTrigger
          size={sheet ? "default" : "sm"}
          className={sheet ? "w-full" : "w-40"}
          aria-label="Subteam"
        >
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
        <SelectTrigger
          size={sheet ? "default" : "sm"}
          className={sheet ? "w-full" : "w-36"}
          aria-label="Source"
        >
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
        size={sheet ? "default" : "sm"}
        variant="outline"
        pressed={filters.hasNotes}
        onPressedChange={(hasNotes) => onChange({ hasNotes })}
        aria-label="Only candidates with notes"
        className={cn(sheet && "justify-start")}
      >
        <MessageSquare aria-hidden />
        Has notes
      </Toggle>
    </>
  );
}
