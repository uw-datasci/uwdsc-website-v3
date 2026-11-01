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

  const setStatus = (id: string, status: SelectionStatus) =>
    mutate(
      (current) =>
        current && {
          ...current,
          cards: current.cards.map((card) => (card.id === id ? { ...card, status } : card)),
        },
      { revalidate: false }
    );

  const move = async (card: BoardCard, to: SelectionStatus, undo = false): Promise<void> => {
    if (card.status === to) return;
    const from = card.status;
    await setStatus(card.id, to);

    try {
      await moveCard(card.id, { from, to, undo });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't move the card");
      await mutate();
      return;
    }

    if (undo) return;
    toast(`${card.name} moved to ${STATUS_LABELS[to]}`, {
      description: `${card.positionName} · was ${STATUS_LABELS[from]}`,
      duration: UNDO_MS,
      action: {
        label: "Undo",
        onClick: () => void move({ ...card, status: to }, from, true),
      },
    });
  };

  return {
    board: data ?? null,
    error: error ?? null,
    isLoading,
    move,
    refresh: async () => {
      await mutate();
    },
  };
}
