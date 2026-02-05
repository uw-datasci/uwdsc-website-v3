"use client";

import { createContext, useContext, useState, useMemo, ReactNode } from "react";

interface AppProgressProvider {
  readonly children: ReactNode;
}

interface AppProgressContextType {
  progressValue: number;
  setProgressValue: (value: number) => void;
}

const AppProgressContext = createContext<AppProgressContextType | undefined>(
  undefined,
);

export function AppProgressProvider({ children }: AppProgressProvider) {
  const [progressValue, setProgressValue] = useState(-1);

  const value = useMemo(
    () => ({ progressValue, setProgressValue }),
    [progressValue],
  );

  return (
    <AppProgressContext.Provider value={value}>
      {children}
    </AppProgressContext.Provider>
  );
}

export function useApplicationProgress() {
  const context = useContext(AppProgressContext);
  if (context === undefined) {
    throw new Error("useApplicationProgress must be used within its provider");
  }
  return context;
}
