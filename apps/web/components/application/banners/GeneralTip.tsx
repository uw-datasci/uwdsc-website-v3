import { User } from "lucide-react";

export function GeneralTip() {
  return (
    <div className="relative flex gap-4 overflow-hidden rounded-lg border border-solid border-cyan-300/50 bg-cyan-300/30 p-4">
      <div className="mx-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-400/20">
        <User className="h-4 w-4 text-cyan-400" />
      </div>

      <div className="flex-1">
        <p className="font-semibold text-cyan-400">Tip:</p>
        <p className="text-sm text-cyan-100">
          Be specific about your experiences and connect them directly to the
          positions you&apos;re applying for.
          <br />
          Show how your unique background will benefit DSC!
        </p>
      </div>
    </div>
  );
}
