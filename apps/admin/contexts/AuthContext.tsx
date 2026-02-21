"use client";

import { createContext, useContext, ReactNode, useMemo } from "react";
import useSWR from "swr";
import { getCurrentUser } from "@/lib/api";
import type { Profile } from "@uwdsc/common/types";

interface AuthContextType {
  user: Profile | null;
  isLoading: boolean;
  isError: boolean;
  mutate: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fetcher function for SWR
const fetcher = async () => {
  try {
    const data = await getCurrentUser();
    return data;
  } catch (error) {
    console.error("Error fetching user in AuthContext:", error);
    return null;
  }
};

export function AuthProvider({ children }: { readonly children: ReactNode }) {
  const { data, error, isLoading, mutate } = useSWR<Profile | null>(
    "/api/auth/user",
    fetcher,
    {
      // Revalidate on window focus
      revalidateOnFocus: false,
      // Revalidate on reconnect
      revalidateOnReconnect: true,
      // Revalidate every 5 minutes in the background
      refreshInterval: 5 * 60 * 1000,
      // Keep data fresh for 1 minute before considering it stale
      dedupingInterval: 60000,
      // Don't retry on error (for 401s)
      shouldRetryOnError: false,
      // Show cached data while revalidating
      revalidateIfStale: true,
    },
  );

  const value: AuthContextType = useMemo(
    () => ({
      user: data ?? null,
      isLoading,
      isError: !!error,
      mutate: async () => {
        await mutate();
      },
      isAuthenticated: !!data,
    }),
    [data, isLoading, error, mutate],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
