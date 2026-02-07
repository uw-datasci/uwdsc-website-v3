"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { TooltipProvider } from "@uwdsc/ui";
import { Toaster } from "sonner";

interface ProvidersProps {
  readonly children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <AuthProvider>
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster />
      </AuthProvider>
    </NextThemesProvider>
  );
}
