"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { useDraggable } from "@dnd-kit/core";
import { GripVertical, Lock, MessageSquare } from "lucide-react";
import { STATUS_LABELS } from "@uwdsc/common/recruiting";
import type { BoardCard as BoardCardData } from "@uwdsc/common/types";
import { cn, Tooltip, TooltipContent, TooltipTrigger } from "@uwdsc/ui";
import { STATUS_TONES } from "@/constants/recruiting";
import {
  formatActivityTime,
  ordinal,
  programLine,
  readOnlyReason,
} from "@/lib/utils/recruiting";

interface BoardCardProps {
  readonly card: BoardCardData;
  readonly others: readonly BoardCardData[];
  readonly conflict: boolean;
  readonly showSubteam: boolean;
  readonly selected?: boolean;
  readonly onOpen?: (card: BoardCardData) => void;
}

export function BoardCard(props: BoardCardProps) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, isDragging } = useDraggable({
    id: props.card.id,
    data: { card: props.card },
    disabled: !props.card.canMove,
  });

  return (
    <div ref={setNodeRef} className={cn(isDragging && "opacity-40")}>
      <BoardCardBody
        {...props}
        handle={
          props.card.canMove ? (
            <button
              ref={setActivatorNodeRef}
              type="button"
              aria-label={`Drag ${props.card.name}`}
              className="-ml-1 flex h-6 w-4 flex-none cursor-grab touch-none items-center justify-center rounded text-muted-foreground hover:text-foreground active:cursor-grabbing"
              onClick={(event) => event.stopPropagation()}
              {...listeners}
              {...attributes}
            >
              <GripVertical className="size-3.5" aria-hidden />
            </button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="-ml-1 flex h-6 w-4 flex-none items-center justify-center text-muted-foreground/60">
                  <Lock className="size-3" aria-hidden />
                  <span className="sr-only">{readOnlyReason(props.card)}</span>
                </span>
              </TooltipTrigger>
              <TooltipContent>{readOnlyReason(props.card)}</TooltipContent>
            </Tooltip>
          )
        }
      />
    </div>
  );
}

/** The card's content, also rendered in the drag overlay. */
export function BoardCardBody({
  card,
  others,
  conflict,
  showSubteam,
  selected,
  onOpen,
  handle,
  overlay,
}: BoardCardProps & { readonly handle?: ReactNode; readonly overlay?: boolean }) {
  const program = programLine(card);
  const open = onOpen ? () => onOpen(card) : undefined;
  const openOnKey = (event: KeyboardEvent) => {
    if (open && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      open();
    }
  };
  const position =
    showSubteam && card.subteamName
      ? `${card.subteamName} · ${card.positionName}`
      : card.positionName;

  return (
    <article
      aria-label={`${card.name}, ${card.positionName}`}
      className={cn(
        "flex gap-1.5 rounded-lg border bg-card p-2.5 shadow-xs transition-colors",
        onOpen && "cursor-pointer hover:border-foreground/20",
        selected && "border-primary ring-1 ring-primary",
        overlay && "w-72 rotate-2 cursor-grabbing shadow-lg"
      )}
      role={open ? "button" : undefined}
      tabIndex={open ? 0 : undefined}
      onClick={open}
      onKeyDown={open ? openOnKey : undefined}
    >
      {handle}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] leading-5 font-medium">{card.name}</div>
            {program && (
              <div className="truncate text-xs leading-4 text-muted-foreground">{program}</div>
            )}
          </div>
          <span
            title={`${ordinal(card.priority)} choice`}
            className={cn(
              "flex-none rounded px-1.5 py-0.5 text-[11px] leading-4 font-medium",
              card.priority === 1
                ? "bg-primary/10 text-primary dark:bg-primary/25 dark:text-violet-200"
                : "text-muted-foreground ring-1 ring-border ring-inset"
            )}
          >
            {ordinal(card.priority)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="min-w-0 flex-1 truncate">{position}</span>
          {card.noteCount > 0 && (
            <span
              className="flex flex-none items-center gap-1"
              title={`${card.noteCount} note${card.noteCount === 1 ? "" : "s"}`}
            >
              <MessageSquare className="size-3" aria-hidden />
              {card.noteCount}
            </span>
          )}
        </div>

        {others.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {others.map((other) => (
              <span
                key={other.id}
                className={cn(
                  "rounded px-1.5 py-px text-[11px] leading-4",
                  STATUS_TONES[other.status].badge
                )}
              >
                #{other.priority} {other.positionName} · {STATUS_LABELS[other.status]}
              </span>
            ))}
          </div>
        )}

        {card.offerExpiresAt && (
          <div
            className={cn(
              "rounded px-1.5 py-0.5 text-[11px] leading-4",
              card.offerExpired
                ? "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-200"
                : STATUS_TONES["Offer Sent"].badge
            )}
          >
            {card.offerExpired ? "No reply by" : "Due"}{" "}
            {formatActivityTime(card.offerExpiresAt)}
          </div>
        )}

        {(card.returning || conflict || card.offerExpired) && (
          <div className="flex flex-wrap gap-1">
            {card.returning && (
              <span className="rounded px-1.5 py-px text-[11px] leading-4 font-medium text-foreground ring-1 ring-border ring-inset">
                Returning
              </span>
            )}
            {conflict && (
              <span
                title="Wanted by two or more subteams"
                className="rounded bg-amber-100 px-1.5 py-px text-[11px] leading-4 font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-200"
              >
                Conflict
              </span>
            )}
            {card.offerExpired && (
              <span className="rounded bg-rose-100 px-1.5 py-px text-[11px] leading-4 font-medium text-rose-800 dark:bg-rose-950 dark:text-rose-200">
                Expired offer
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
