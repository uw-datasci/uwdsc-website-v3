"use client";

import { Fragment, useState, type ReactNode } from "react";
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
  REVIEW_STATUSES,
  SELECTION_STATUSES,
  wantedSubteams,
  type SelectionStatus,
} from "@uwdsc/common/recruiting";
import type { BoardCard as BoardCardData } from "@uwdsc/common/types";
import { Button, Spinner } from "@uwdsc/ui";
import { OFFER_COLUMN_LOCKS } from "@/constants/recruiting";
import { useRecruiting } from "@/contexts/RecruitingContext";
import { useBoard } from "@/hooks/useBoard";
import { cardsByApplication, groupCards, matchesFilters } from "@/lib/utils/recruiting";
import type { BoardFilters as Filters, BoardGroup } from "@/types/recruiting";
import { BoardCardBody } from "./BoardCard";
import { BoardColumn, type DropState } from "./BoardColumn";
import { BoardFilters } from "./BoardFilters";
import { BoardList } from "./BoardList";
import { CandidateDrawer } from "../candidate";

/**
 * Recruiting → Board: columns by status, one card per candidate per column. A candidate's
 * positions at the same status share a card and move together; the drawer moves one.
 */
export function BoardPage() {
  const { capabilities } = useRecruiting();
  const { board, error, isLoading, move, moveCards } = useBoard();
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
  const [dragging, setDragging] = useState<BoardGroup | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [listStatus, setListStatus] = useState<SelectionStatus | null>(null);
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
  const othersFor = (group: BoardGroup) => {
    const inGroup = new Set(group.cards.map((card) => card.id));
    const lead = group.cards[0];
    return lead ? siblings(lead).filter((other) => !inGroup.has(other.id)) : [];
  };
  const conflictFor = (group: BoardGroup) => {
    const lead = group.cards[0];
    return lead ? wantedSubteams(siblings(lead)).length >= 2 : false;
  };

  const visible = board.cards.filter((card) => matchesFilters(card, filters, viewerSubteamId));
  const groups = groupCards(visible);
  const candidates = new Set(visible.map((card) => card.applicationId)).size;
  const countText = `${visible.length} card${visible.length === 1 ? "" : "s"} · ${candidates} candidate${candidates === 1 ? "" : "s"}`;

  const shownStatus =
    listStatus ??
    REVIEW_STATUSES.find((status) => visible.some((card) => card.status === status)) ??
    "In Review";

  const openCard = board.cards.find((card) => card.id === openId) ?? null;
  const openColumn = openCard
    ? groups
        .filter((group) => group.status === openCard.status)
        .flatMap((group) => {
          const shown = group.cards.find((card) => card.id === openCard.id) ?? group.cards[0];
          return shown ? [shown] : [];
        })
    : [];

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
    setDragging((active.data.current?.group as BoardGroup | undefined) ?? null);
  };
  const onDragEnd = ({ over }: DragEndEvent) => {
    const group = dragging;
    setDragging(null);
    const to = over?.id as SelectionStatus | undefined;
    if (group && to && targets.has(to)) {
      void moveCards(
        group.cards.filter((card) => card.canMove),
        to
      );
    }
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

      {board.cards.length === 0 && (
        <EmptyNotice
          title="No applications yet"
          body="Cards show up here as people apply."
        />
      )}
      {board.cards.length > 0 && visible.length === 0 && (
        <EmptyNotice
          title="No cards match these filters"
          body="Try a wider search or clear the filters."
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setFilters({
                mine: false,
                positionId: null,
                subteamId: null,
                source: "all",
                hasNotes: false,
                search: "",
              })
            }
          >
            Clear filters
          </Button>
        </EmptyNotice>
      )}

      <div className="md:hidden">
        <BoardList
          groups={groups}
          status={shownStatus}
          onStatusChange={setListStatus}
          othersFor={othersFor}
          conflictFor={conflictFor}
          showSubteam={!filters.mine}
          selectedId={openId}
          onOpen={(card) => setOpenId(card.id)}
          onMove={moveCards}
        />
      </div>

      <div className="hidden md:block">
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragCancel={() => setDragging(null)}
        >
          <div
            role="region"
            aria-label="Candidate board"
            data-tour="columns"
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
                  groups={groups.filter((group) => group.status === status)}
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
                group={dragging}
                others={othersFor(dragging)}
                conflict={conflictFor(dragging)}
                showSubteam={!filters.mine}
                overlay
              />
            )}
          </DragOverlay>
        </DndContext>
      </div>

      <CandidateDrawer
        card={openCard}
        siblings={openCard ? siblings(openCard) : []}
        column={openColumn}
        conflict={openCard ? wantedSubteams(siblings(openCard)).length >= 2 : false}
        onNavigate={(card) => setOpenId(card.id)}
        onClose={() => setOpenId(null)}
        onMove={move}
      />
    </div>
  );
}

function EmptyNotice({
  title,
  body,
  children,
}: {
  readonly title: string;
  readonly body: string;
  readonly children?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-dashed px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{body}</p>
      </div>
      {children}
    </div>
  );
}
