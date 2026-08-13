"use client";

import { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { PageViewTracker } from "@/components/tracking/PageViewTracker";
import { ActiveTimeTracker } from "@/components/tracking/ActiveTimeTracker";
import { TooltipProvider } from "@uwdsc/ui";

interface AppProvidersProps {
  readonly children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <NextThemesProvider
      attribute="class"
      forcedTheme="dark"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <AuthProvider>
        <PageViewTracker />
        <ActiveTimeTracker />
        <TooltipProvider>{children}</TooltipProvider>
      </AuthProvider>
    </NextThemesProvider>
  );
}
