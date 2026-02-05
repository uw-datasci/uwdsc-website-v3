import { Info } from "lucide-react";

export function DuplicateBanner() {
  return (
    <div className="relative flex gap-4 overflow-hidden rounded-lg border border-solid border-cyan-300/50 bg-cyan-300/30 p-4">
      <div className="mx-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-400/20">
        <Info className="h-4 w-4 text-cyan-400" />
      </div>

      <div className="flex-1">
        <p className="font-semibold text-cyan-400">Duplicate Questions:</p>
        <p className="text-sm text-cyan-100">
          If any roles have overlapping questions, please only answer one and
          put &apos;N/A&apos; for the overlapping
        </p>
      </div>
    </div>
  );
}
