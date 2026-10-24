"use client";

import { useSWRConfig } from "swr";
import { toast } from "sonner";
import { OFFERS_KEY, respondToOffer } from "@/lib/api";
import { BOARD_KEY } from "./useBoard";

/** Revalidate everything an offer or rejection changes. */
export function useRefreshDecisions() {
  const { mutate } = useSWRConfig();
  return async () => {
    await Promise.all([mutate(OFFERS_KEY), mutate(BOARD_KEY)]);
  };
}

/** Mark an offer accepted / declined (or correct it), with a toast. */
export function useOfferResponse() {
  const refresh = useRefreshDecisions();
  return async (
    card: { selectionId: string; name: string },
    response: "accepted" | "declined"
  ): Promise<void> => {
    try {
      await respondToOffer(card.selectionId, { response });
      toast.success(`${card.name} marked ${response}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save the reply");
    } finally {
      await refresh();
    }
  };
}
