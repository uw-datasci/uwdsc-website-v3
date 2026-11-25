"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import useSWR from "swr";
import { useRecruiting } from "@/contexts/RecruitingContext";
import { completeTour, getCompletedTours, TOUR_KEY } from "@/lib/api";
import { TourOverlay } from "./TourOverlay";
import { TOURS, tourFor } from "./tours";

interface TourContextValue {
  start: () => void;
  available: boolean;
  completed: boolean;
}

const TourContext = createContext<TourContextValue>({
  start: () => {},
  available: false,
  completed: false,
});

export function useTour(): TourContextValue {
  return useContext(TourContext);
}

/** Runs the role's guided tour: on its own on the first unlocked Overview visit, or from "?". */
export function TourProvider({ children }: { readonly children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { capabilities } = useRecruiting();
  const available = !!capabilities && !capabilities.locked;
  const tour = tourFor(capabilities?.viewer.role ?? "vp");
  const steps = TOURS[tour];

  const { data: completedTours, mutate } = useSWR<string[], Error>(
    available ? TOUR_KEY : null,
    getCompletedTours,
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );
  const completed = completedTours?.includes(tour) ?? false;

  const [running, setRunning] = useState<boolean | null>(null);
  const [step, setStep] = useState(0);

  const autoStart =
    available && completedTours !== undefined && !completed && pathname === "/recruiting";
  const open = running ?? autoStart;

  const goTo = (index: number) => {
    const next = steps[index];
    if (!next) return;
    setRunning(true);
    setStep(index);
    if (next.href && next.href !== pathname) router.push(next.href);
  };

  const start = () => goTo(0);

  const finish = () => {
    setRunning(false);
    setStep(0);
    if (!completed) {
      void mutate(
        async (current) => {
          await completeTour({ tour });
          return [...(current ?? []), tour];
        },
        { optimisticData: (current) => [...(current ?? []), tour], rollbackOnError: false }
      );
    }
  };

  return (
    <TourContext.Provider value={{ start, available, completed }}>
      {children}
      {open && (
        <TourOverlay
          steps={steps}
          index={Math.min(step, steps.length - 1)}
          onBack={() => goTo(step - 1)}
          onNext={() => (step >= steps.length - 1 ? finish() : goTo(step + 1))}
          onClose={finish}
        />
      )}
    </TourContext.Provider>
  );
}
