import { Crown } from "lucide-react";

export function VPConsideration() {
  return (
    <div className="relative flex gap-4 overflow-hidden rounded-lg border border-solid border-amber-200/50 bg-amber-200/30 p-4">
      <div className="mx-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-400/20">
        <Crown className="h-4 w-4 text-amber-400" />
      </div>

      <div className="flex-1">
        <p className="font-semibold text-amber-400">Duplicate Questions:</p>
        <p className="text-sm text-amber-200">
          If you are applying for a VP Role, we will also consider you for an
          exec role in the same sub-team. Make sure to clearly indicate your
          preferences!
        </p>
      </div>
    </div>
  );
}
