"use client";

import { ArrowRightLeft } from "lucide-react";
import { dragTargets, STATUS_LABELS, type SelectionStatus } from "@uwdsc/common/recruiting";
import type { BoardCard } from "@uwdsc/common/types";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@uwdsc/ui";
import type { BoardGroup } from "@/types/recruiting";
import { StatusDot } from "./StatusBadge";

/** Move a card without dragging: the review statuses its positions can go to. */
export function StatusMenu({
  group,
  onMove,
}: {
  readonly group: BoardGroup;
  readonly onMove: (cards: readonly BoardCard[], to: SelectionStatus) => Promise<void>;
}) {
  const movable = group.cards.filter((card) => card.canMove);
  const lead = group.cards[0];
  const targets = movable.length > 0 ? dragTargets(group.status) : [];
  if (!lead || targets.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="size-9 flex-none"
          aria-label={`Move ${lead.name}, ${movable.map((card) => card.positionName).join(", ")}`}
        >
          <ArrowRightLeft className="size-4" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Move to</DropdownMenuLabel>
        {targets.map((status) => (
          <DropdownMenuItem key={status} onSelect={() => void onMove(movable, status)}>
            <StatusDot status={status} />
            {STATUS_LABELS[status]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
