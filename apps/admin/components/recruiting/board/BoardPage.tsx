"use client";

import { Fragment, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  DECISION_STATUSES,
  dragTargets,
  isReviewStatus,
  SELECTION_STATUSES,
  wantedSubteams,
  type SelectionStatus,
} from "@uwdsc/common/recruiting";
import type { BoardCard as BoardCardData } from "@uwdsc/common/types";
import { Spinner } from "@uwdsc/ui";
import { OFFER_COLUMN_LOCKS } from "@/constants/recruiting";
import { useRecruiting } from "@/contexts/RecruitingContext";
import { useBoard } from "@/hooks/useBoard";
import { cardsByApplication, matchesFilters } from "@/lib/utils/recruiting";
import type { BoardFilters as Filters } from "@/types/recruiting";
import { BoardCardBody } from "./BoardCard";
import { BoardColumn, type DropState } from "./BoardColumn";
import { BoardFilters } from "./BoardFilters";
import { CandidateDrawer } from "../candidate";

/** Recruiting → Board: one card per candidate × position, columns by status. */
export function BoardPage() {
  const { capabilities } = useRecruiting();
  const { board, error, isLoading, move } = useBoard();
  const viewer = capabilities?.viewer;
  const isVp = viewer?.role === "vp";
  const viewerSubteamId = viewer?.subteamId ?? null;
  const canFilterMine = isVp && viewerSubteamId !== null;

  const [filters, setFilters] = useState<Filters>({
    mine: canFilterMine,
    positionId: null,
    subteamId: null,
    source: "all",
    hasNotes: false,
    search: "",
  });
  const [collapsed, setCollapsed] = useState<ReadonlySet<SelectionStatus>>(
    () => new Set(isVp ? DECISION_STATUSES : [])
  );
  const [dragging, setDragging] = useState<BoardCardData | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner className="size-8" />
      </div>
    );
  }
  if (error || !board) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
        Couldn&apos;t load the board: {error?.message ?? "unknown error"}
      </div>
    );
  }

  const byApplication = cardsByApplication(board.cards);
  const siblings = (card: BoardCardData) => byApplication.get(card.applicationId) ?? [card];
  const othersFor = (card: BoardCardData) =>
    siblings(card).filter((other) => other.id !== card.id);
  const conflictFor = (card: BoardCardData) => wantedSubteams(siblings(card)).length >= 2;

  const visible = board.cards.filter((card) => matchesFilters(card, filters, viewerSubteamId));
  const candidates = new Set(visible.map((card) => card.applicationId)).size;
  const countText = `${visible.length} card${visible.length === 1 ? "" : "s"} · ${candidates} candidate${candidates === 1 ? "" : "s"}`;

  const openCard = board.cards.find((card) => card.id === openId) ?? null;
  const openColumn = openCard ? visible.filter((card) => card.status === openCard.status) : [];

  const targets = new Set<SelectionStatus>(dragging ? dragTargets(dragging.status) : []);
  const dropState = (status: SelectionStatus): DropState => {
    if (!dragging || status === dragging.status) return "idle";
    return targets.has(status) ? "target" : "dim";
  };

  const toggle = (status: SelectionStatus) =>
    setCollapsed((current) => {
      const next = new Set(current);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });

  const onDragStart = ({ active }: DragStartEvent) => {
    setDragging((active.data.current?.card as BoardCardData | undefined) ?? null);
  };
  const onDragEnd = ({ over }: DragEndEvent) => {
    const card = dragging;
    setDragging(null);
    const to = over?.id as SelectionStatus | undefined;
    if (card && to && targets.has(to)) void move(card, to);
  };

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <BoardFilters
        board={board}
        filters={filters}
        onChange={(patch) => setFilters((current) => ({ ...current, ...patch }))}
        canFilterMine={canFilterMine}
        countText={countText}
      />

      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragCancel={() => setDragging(null)}
      >
        <div
          role="region"
          aria-label="Candidate board"
          className="flex gap-3 overflow-x-auto pb-3"
        >
          {SELECTION_STATUSES.map((status) => (
            <Fragment key={status}>
              {status === DECISION_STATUSES[0] && (
                <div
                  role="separator"
                  aria-orientation="vertical"
                  aria-label="Offer stages"
                  className="flex flex-none flex-col items-center gap-2 pt-2"
                >
                  <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase [writing-mode:vertical-rl]">
                    Offers
                  </span>
                  <span className="w-px flex-1 bg-border" />
                </div>
              )}
              <BoardColumn
                status={status}
                cards={visible.filter((card) => card.status === status)}
                collapsed={collapsed.has(status)}
                onToggle={() => toggle(status)}
                lockReason={
                  isReviewStatus(status) ? null : OFFER_COLUMN_LOCKS[isVp ? "vp" : "pres"]
                }
                dropState={dropState(status)}
                othersFor={othersFor}
                conflictFor={conflictFor}
                showSubteam={!filters.mine}
                selectedId={openId}
                onOpen={(card) => setOpenId(card.id)}
              />
            </Fragment>
          ))}
        </div>

        <DragOverlay dropAnimation={null}>
          {dragging && (
            <BoardCardBody
              card={dragging}
              others={othersFor(dragging)}
              conflict={conflictFor(dragging)}
              showSubteam={!filters.mine}
              overlay
            />
          )}
        </DragOverlay>
      </DndContext>

      <CandidateDrawer
        card={openCard}
        siblings={openCard ? siblings(openCard) : []}
        column={openColumn}
        conflict={openCard ? conflictFor(openCard) : false}
        onNavigate={(card) => setOpenId(card.id)}
        onClose={() => setOpenId(null)}
        onMove={move}
      />
    </div>
  );
}
