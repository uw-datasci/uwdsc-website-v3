import { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";

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
      <AuthProvider>{children}</AuthProvider>
    </NextThemesProvider>
  );
}
