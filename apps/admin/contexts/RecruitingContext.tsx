"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import useSWR from "swr";
import type { RecruitingCapabilities } from "@uwdsc/common/recruiting";
import { getRecruitingContext } from "@/lib/api/recruiting";

interface RecruitingContextType {
  capabilities: RecruitingCapabilities | null;
  isLoading: boolean;
  error: Error | null;
  /** Refetch capabilities (e.g. after starting a cycle). */
  refresh: () => Promise<void>;
}

const RecruitingContext = createContext<RecruitingContextType | undefined>(undefined);

export function RecruitingProvider({ children }: { readonly children: ReactNode }) {
  const { data, error, isLoading, mutate } = useSWR<RecruitingCapabilities, Error>(
    "/api/recruiting/context",
    getRecruitingContext,
    { revalidateOnFocus: true, shouldRetryOnError: false }
  );

  const value = useMemo<RecruitingContextType>(
    () => ({
      capabilities: data ?? null,
      isLoading,
      error: error ?? null,
      refresh: async () => {
        await mutate();
      },
    }),
    [data, isLoading, error, mutate]
  );

  return <RecruitingContext.Provider value={value}>{children}</RecruitingContext.Provider>;
}

export function useRecruiting() {
  const context = useContext(RecruitingContext);
  if (!context) throw new Error("useRecruiting must be used within a RecruitingProvider");
  return context;
}
