import { CheckCircle2 } from "lucide-react";
import type { Event } from "@uwdsc/common/types";

interface CheckedInStateProps {
  readonly activeEvent: Event | null;
}

export function CheckedInState({ activeEvent }: CheckedInStateProps) {
  return (
    <main className="flex flex-col items-center justify-center px-4 text-center">
      <div className="rounded-2xl border bg-card p-8 max-w-md w-full shadow-sm">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 animate-in zoom-in duration-300">
          <CheckCircle2 className="size-12 text-emerald-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">You&apos;re Checked In!</h1>
        {activeEvent && (
          <p className="text-muted-foreground">
            You&apos;ve already checked in for{" "}
            <span className="font-medium text-foreground">
              {activeEvent.name}
            </span>. Enjoy the event!
          </p>
        )}
      </div>
    </main>
  );
}
