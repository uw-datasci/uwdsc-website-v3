"use client";

import { TriangleAlert } from "lucide-react";
import {
  isReviewStatus,
  REVIEW_STATUSES,
  STATUS_LABELS,
  wantedSubteams,
  type SelectionStatus,
} from "@uwdsc/common/recruiting";
import type { BoardCard } from "@uwdsc/common/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uwdsc/ui";
import { StatusBadge, StatusDot } from "../board/StatusBadge";

interface PositionsStripProps {
  readonly cards: readonly BoardCard[];
  readonly appliedOn: string | null;
  readonly onMove: (card: BoardCard, to: SelectionStatus) => void;
}

function readOnlyReason(card: BoardCard): string {
  if (!isReviewStatus(card.status)) return "Set by offers and the candidate's response.";
  if (card.isVp) return "View only. Presidents review applicants for VP roles.";
  return `View only. VP, ${card.subteamName ?? "this subteam"} and presidents can change this.`;
}

export function PositionsStrip({ cards, appliedOn, onMove }: PositionsStripProps) {
  const wantedBy = wantedSubteams(cards);
  const first = cards[0];

  return (
    <section className="flex flex-col gap-2 border-b px-5 py-4">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Positions
        </h3>
        {appliedOn && (
          <span className="text-xs text-muted-foreground">Applied {appliedOn}</span>
        )}
      </div>

      <ul className="flex flex-col gap-1.5">
        {cards.map((card) => {
          const editable = card.canMove && isReviewStatus(card.status);
          return (
            <li key={card.id} className="flex items-center gap-2.5">
              <span className="w-6 flex-none text-xs text-muted-foreground tabular-nums">
                #{card.priority}
              </span>
              <div className="min-w-0 flex-1 truncate text-sm">
                <span className="font-medium">{card.positionName}</span>
                {card.subteamName && (
                  <span className="text-muted-foreground"> · {card.subteamName}</span>
                )}
              </div>
              {editable ? (
                <Select
                  value={card.status}
                  onValueChange={(value) => onMove(card, value as SelectionStatus)}
                >
                  <SelectTrigger
                    size="sm"
                    className="w-40"
                    aria-label={`Status for ${card.positionName}: ${STATUS_LABELS[card.status]}`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REVIEW_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        <StatusDot status={status} />
                        {STATUS_LABELS[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span tabIndex={0} className="flex w-40 justify-end">
                      <StatusBadge status={card.status} />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>{readOnlyReason(card)}</TooltipContent>
                </Tooltip>
              )}
            </li>
          );
        })}
      </ul>

      {wantedBy.length >= 2 && (
        <p className="mt-1 flex items-start gap-2 rounded-md bg-amber-100 px-3 py-2 text-[13px] text-amber-900 dark:bg-amber-950 dark:text-amber-200">
          <TriangleAlert className="mt-0.5 size-3.5 flex-none" aria-hidden />
          <span>
            <strong>Wanted by {wantedBy.join(" and ")}.</strong> Presidents decide which offer
            they get.{first ? ` Their 1st choice is ${first.positionName}.` : ""}
          </span>
        </p>
      )}
    </section>
  );
}
