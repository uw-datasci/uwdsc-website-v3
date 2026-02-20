import { XCircle, RotateCcw } from "lucide-react";
import { Button } from "@uwdsc/ui";

interface FailureStateProps {
  readonly error: string;
  readonly onRetry: () => void;
}

export function FailureState({ error, onRetry }: FailureStateProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="rounded-2xl border bg-card p-8 max-w-md w-full shadow-sm">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <XCircle className="size-12 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Check-in Failed</h2>
        <p className="text-sm text-muted-foreground mb-6">{error}</p>

        <Button onClick={onRetry} className="w-full">
          <RotateCcw className="mr-2 size-4" />
          Try Again
        </Button>
      </div>
    </div>
  );
}
