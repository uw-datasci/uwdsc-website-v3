"use client";

import useSWR from "swr";
import { getApplyWindowOpen } from "@/lib/api";
import type { ApplyWindowOpenResponse } from "@/types/application";

const CLOSED: ApplyWindowOpenResponse = {
  open: false,
  softDeadline: null,
  hardDeadline: null,
  termCode: null,
};

// On failure, fall back to "closed" so the Apply link and hero callout stay hidden.
const fetcher = async (): Promise<ApplyWindowOpenResponse> => {
  try {
    return await getApplyWindowOpen();
  } catch (error) {
    console.error("Error fetching apply window:", error);
    return CLOSED;
  }
};

/**
 * Public exec-application window state. Keyed on the endpoint so every consumer
 * (navbar + hero) shares a single deduped SWR request.
 */
export function useApplyWindow() {
  const { data, isLoading } = useSWR<ApplyWindowOpenResponse>(
    "/api/applications/apply-open",
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 5 * 60 * 1000,
      dedupingInterval: 60000,
      shouldRetryOnError: false,
    }
  );

  return {
    open: Boolean(data?.open),
    softDeadline: data?.softDeadline ?? null,
    hardDeadline: data?.hardDeadline ?? null,
    termCode: data?.termCode ?? null,
    isLoading,
  };
}
