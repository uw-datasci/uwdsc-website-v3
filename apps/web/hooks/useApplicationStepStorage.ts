import { useCallback, useEffect } from "react";

interface UseApplicationStepStorageOptions {
  termId: string | null;
  currentStep: number;
}

export function useApplicationStepStorage({
  termId,
  currentStep,
}: UseApplicationStepStorageOptions) {
  const getStepStorageKey = useCallback(
    (id: string) => `application:current-step:${id}`,
    [],
  );

  const readStoredStep = useCallback(
    (id: string): number | null => {
      try {
        const rawValue = window.localStorage.getItem(getStepStorageKey(id));
        if (rawValue === null || rawValue.trim() === "") return null;
        const parsed = Number(rawValue);
        if (!Number.isInteger(parsed)) return null;
        return parsed;
      } catch {
        return null;
      }
    },
    [getStepStorageKey],
  );

  const clearStoredStep = useCallback(
    (id: string) => {
      try {
        window.localStorage.removeItem(getStepStorageKey(id));
      } catch {
        // no-op
      }
    },
    [getStepStorageKey],
  );

  useEffect(() => {
    if (!termId) return;
    if (currentStep === 5) {
      clearStoredStep(termId);
      return;
    }
    if (currentStep < 1 || currentStep > 4) return;

    try {
      window.localStorage.setItem(
        getStepStorageKey(termId),
        String(currentStep),
      );
    } catch {
      // no-op
    }
  }, [currentStep, termId, clearStoredStep, getStepStorageKey]);

  return {
    readStoredStep,
    clearStoredStep,
  };
}
