"use client";

import { useDroppable } from "@dnd-kit/core";
import { ChevronsLeftRight, ChevronsRightLeft, Lock } from "lucide-react";
import { isReviewStatus, STATUS_LABELS, type SelectionStatus } from "@uwdsc/common/recruiting";
import type { BoardCard as BoardCardData } from "@uwdsc/common/types";
import { Button, cn, Tooltip, TooltipContent, TooltipTrigger } from "@uwdsc/ui";
import { BoardCard } from "./BoardCard";
import { StatusDot } from "./StatusBadge";

/** How a column looks while a card is being dragged. */
export type DropState = "idle" | "target" | "over" | "dim";

interface BoardColumnProps {
  readonly status: SelectionStatus;
  readonly cards: readonly BoardCardData[];
  readonly collapsed: boolean;
  readonly onToggle: () => void;
  /** Why cards can't be dragged into this column. */
  readonly lockReason: string | null;
  readonly dropState: DropState;
  readonly othersFor: (card: BoardCardData) => readonly BoardCardData[];
  readonly conflictFor: (card: BoardCardData) => boolean;
  readonly showSubteam: boolean;
  readonly selectedId?: string | null;
  readonly onOpen?: (card: BoardCardData) => void;
}

export function BoardColumn({
  status,
  cards,
  collapsed,
  onToggle,
  lockReason,
  dropState,
  othersFor,
  conflictFor,
  showSubteam,
  selectedId,
  onOpen,
}: BoardColumnProps) {
  const label = STATUS_LABELS[status];
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    disabled: !isReviewStatus(status),
  });
  const state: DropState = dropState === "target" && isOver ? "over" : dropState;

  const lock = lockReason && (
    <Tooltip>
      <TooltipTrigger asChild>
        <span tabIndex={0} className="flex text-muted-foreground">
          <Lock className="size-3" aria-label="Locked" />
        </span>
      </TooltipTrigger>
      <TooltipContent>{lockReason}</TooltipContent>
    </Tooltip>
  );

  if (collapsed) {
    return (
      <section
        ref={setNodeRef}
        aria-label={`${label}, ${cards.length} cards, collapsed`}
        className={cn(
          "flex w-10 flex-none flex-col items-center gap-2 rounded-lg bg-muted/50 py-2 transition-opacity",
          state === "dim" && "opacity-40"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          aria-label={`Expand ${label}`}
          onClick={onToggle}
        >
          <ChevronsLeftRight className="size-3.5" aria-hidden />
        </Button>
        <StatusDot status={status} />
        <span className="text-xs text-muted-foreground tabular-nums">{cards.length}</span>
        <h2 className="text-xs font-semibold [writing-mode:vertical-rl]">{label}</h2>
        {lock}
      </section>
    );
  }

  return (
    <section
      ref={setNodeRef}
      aria-label={`${label}, ${cards.length} cards`}
      className={cn(
        "flex max-h-[calc(100svh-15rem)] min-h-64 w-72 flex-none flex-col rounded-lg bg-muted/50 transition-[opacity,background-color]",
        state === "dim" && "opacity-40",
        state === "target" &&
          "outline outline-1 -outline-offset-1 outline-muted-foreground/50 outline-dashed",
        state === "over" &&
          "bg-primary/10 outline-2 -outline-offset-2 outline-primary outline-dashed"
      )}
    >
      <header className="flex items-center gap-2 px-3 pt-2.5 pb-2">
        <StatusDot status={status} />
        <h2 className="text-[13px] font-semibold">{label}</h2>
        <span className="text-xs text-muted-foreground tabular-nums">{cards.length}</span>
        {lock}
        {state === "over" && (
          <span className="text-xs font-medium text-primary">Release to move here</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto size-7"
          aria-label={`Collapse ${label}`}
          onClick={onToggle}
        >
          <ChevronsRightLeft className="size-3.5" aria-hidden />
        </Button>
      </header>

      <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-2 pb-2">
        {cards.map((card) => (
          <BoardCard
            key={card.id}
            card={card}
            others={othersFor(card)}
            conflict={conflictFor(card)}
            showSubteam={showSubteam}
            selected={card.id === selectedId}
            onOpen={onOpen}
          />
        ))}
        {cards.length === 0 && (
          <p className="px-2 py-6 text-center text-xs text-muted-foreground">No one here</p>
        )}
      </div>
    </section>
  );
}
