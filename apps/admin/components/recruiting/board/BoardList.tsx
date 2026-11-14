"use client";

import { Fragment } from "react";
import { Lock } from "lucide-react";
import {
  DECISION_STATUSES,
  isReviewStatus,
  SELECTION_STATUSES,
  STATUS_LABELS,
  type SelectionStatus,
} from "@uwdsc/common/recruiting";
import type { BoardCard as BoardCardData } from "@uwdsc/common/types";
import { cn } from "@uwdsc/ui";
import { COLUMN_EMPTY } from "@/constants/recruiting";
import { readOnlyReason } from "@/lib/utils/recruiting";
import { BoardCardBody } from "./BoardCard";
import { StatusDot } from "./StatusBadge";
import { StatusMenu } from "./StatusMenu";

interface BoardListProps {
  readonly cards: readonly BoardCardData[];
  readonly status: SelectionStatus;
  readonly onStatusChange: (status: SelectionStatus) => void;
  readonly othersFor: (card: BoardCardData) => BoardCardData[];
  readonly conflictFor: (card: BoardCardData) => boolean;
  readonly showSubteam: boolean;
  readonly selectedId: string | null;
  readonly onOpen: (card: BoardCardData) => void;
  readonly onMove: (card: BoardCardData, to: SelectionStatus) => Promise<void>;
}

/** The board on phones: one status at a time, moved with a menu instead of dragging. */
export function BoardList({
  cards,
  status,
  onStatusChange,
  othersFor,
  conflictFor,
  showSubteam,
  selectedId,
  onOpen,
  onMove,
}: BoardListProps) {
  const shown = cards.filter((card) => card.status === status);

  return (
    <div className="flex flex-col gap-3">
      <div
        role="group"
        aria-label="Status"
        className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none]"
      >
        {SELECTION_STATUSES.map((option) => {
          const count = cards.filter((card) => card.status === option).length;
          const active = option === status;
          return (
            <Fragment key={option}>
              {option === DECISION_STATUSES[0] && (
                <span aria-hidden className="my-1 w-px flex-none bg-border" />
              )}
              <button
                type="button"
                aria-pressed={active}
                onClick={() => onStatusChange(option)}
                className={cn(
                  "flex h-9 flex-none items-center gap-1.5 rounded-full border px-3 text-[13px] whitespace-nowrap",
                  active ? "border-foreground bg-foreground text-background" : "bg-card"
                )}
              >
                <StatusDot status={option} />
                {STATUS_LABELS[option]}
                <span
                  className={cn(
                    "tabular-nums",
                    active ? "text-background/70" : "text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              </button>
            </Fragment>
          );
        })}
      </div>

      <ul
        data-tour="columns"
        aria-label={STATUS_LABELS[status]}
        className="flex flex-col gap-2"
      >
        {shown.length === 0 && (
          <li className="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
            {COLUMN_EMPTY[status]}
          </li>
        )}
        {shown.map((card) => {
          const locked = isReviewStatus(card.status) && !card.canMove;
          return (
            <li key={card.id} className="flex flex-col gap-1">
              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <BoardCardBody
                    card={card}
                    others={othersFor(card)}
                    conflict={conflictFor(card)}
                    showSubteam={showSubteam}
                    selected={card.id === selectedId}
                    onOpen={onOpen}
                  />
                </div>
                <StatusMenu card={card} onMove={onMove} />
              </div>
              {locked && (
                <p className="flex items-center gap-1.5 px-1 text-xs text-muted-foreground">
                  <Lock className="size-3 flex-none" aria-hidden />
                  {readOnlyReason(card)}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
