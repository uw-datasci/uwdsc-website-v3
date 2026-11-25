"use client";

import useSWR from "swr";
import { toast } from "sonner";
import { STATUS_LABELS, type SelectionStatus } from "@uwdsc/common/recruiting";
import type { BoardCard, BoardView } from "@uwdsc/common/types";
import { getBoard, moveCard } from "@/lib/api";

export const BOARD_KEY = "/api/recruiting/board";

const UNDO_MS = 6000;

/** The board's cards, refetched on focus, and `move` for status changes with Undo. */
export function useBoard() {
  const { data, error, isLoading, mutate } = useSWR<BoardView, Error>(BOARD_KEY, getBoard, {
    revalidateOnFocus: true,
    shouldRetryOnError: false,
  });

  const setStatus = (ids: ReadonlySet<string>, status: SelectionStatus) =>
    mutate(
      (current) =>
        current && {
          ...current,
          cards: current.cards.map((card) => (ids.has(card.id) ? { ...card, status } : card)),
        },
      { revalidate: false }
    );

  /** Move several of one candidate's cards (all at the same status) together. */
  const moveCards = async (
    cards: readonly BoardCard[],
    to: SelectionStatus,
    undo = false
  ): Promise<void> => {
    const moving = cards.filter((card) => card.status !== to);
    const first = moving[0];
    if (!first) return;
    const from = first.status;
    await setStatus(new Set(moving.map((card) => card.id)), to);

    const results = await Promise.allSettled(
      moving.map((card) => moveCard(card.id, { from: card.status, to, undo }))
    );
    const failed = results.find((result) => result.status === "rejected");
    if (failed) {
      const reason = (failed as PromiseRejectedResult).reason;
      toast.error(reason instanceof Error ? reason.message : "Couldn't move the card");
      await mutate();
      return;
    }

    if (undo) return;
    toast(`${first.name} moved to ${STATUS_LABELS[to]}`, {
      description: `${moving.map((card) => card.positionName).join(", ")} · was ${STATUS_LABELS[from]}`,
      duration: UNDO_MS,
      action: {
        label: "Undo",
        onClick: () =>
          void moveCards(
            moving.map((card) => ({ ...card, status: to })),
            from,
            true
          ),
      },
    });
  };

  const move = (card: BoardCard, to: SelectionStatus): Promise<void> => moveCards([card], to);

  return {
    board: data ?? null,
    error: error ?? null,
    isLoading,
    move,
    moveCards,
    refresh: async () => {
      await mutate();
    },
  };
}
