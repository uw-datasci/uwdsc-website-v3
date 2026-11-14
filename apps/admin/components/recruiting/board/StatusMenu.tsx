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
import { StatusDot } from "./StatusBadge";

/** Move a card without dragging: the review statuses it can go to. */
export function StatusMenu({
  card,
  onMove,
}: {
  readonly card: BoardCard;
  readonly onMove: (card: BoardCard, to: SelectionStatus) => Promise<void>;
}) {
  const targets = card.canMove ? dragTargets(card.status) : [];
  if (targets.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="size-9 flex-none"
          aria-label={`Move ${card.name}, ${card.positionName}`}
        >
          <ArrowRightLeft className="size-4" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Move to</DropdownMenuLabel>
        {targets.map((status) => (
          <DropdownMenuItem key={status} onSelect={() => void onMove(card, status)}>
            <StatusDot status={status} />
            {STATUS_LABELS[status]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
