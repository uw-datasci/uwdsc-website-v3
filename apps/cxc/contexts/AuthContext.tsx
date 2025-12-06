"use client";

import { createContext, useContext, ReactNode, useMemo } from "react";
import useSWR from "swr";
import { getUserProfile } from "@/lib/api";
import type { UserProfile } from "@/types/api";

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isError: boolean;
  mutate: () => Promise<UserProfile | null | undefined>; // For manual revalidation
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fetcher function for SWR using the API abstraction
const fetcher = async () => {
  return await getUserProfile();
};

export function AuthProvider({ children }: { readonly children: ReactNode }) {
  const { data, error, isLoading, mutate } = useSWR<UserProfile | null>(
    "/api/profile",
    fetcher,
    {
      // Revalidate on window focus
      revalidateOnFocus: true,
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
    }
  );

  const value: AuthContextType = useMemo(
    () => ({
      user: data ?? null,
      isLoading,
      isError: !!error,
      mutate,
      isAuthenticated: !!data && data !== null,
    }),
    [data, isLoading, error, mutate]
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
