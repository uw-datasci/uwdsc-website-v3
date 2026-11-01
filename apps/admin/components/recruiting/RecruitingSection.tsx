"use client";

import type { ReactNode } from "react";
import { Lock } from "lucide-react";
import type { RecruitingTab } from "@uwdsc/common/recruiting";
import { useRecruiting } from "@/contexts/RecruitingContext";
import { LockedState } from "./LockedState";

interface RecruitingSectionProps {
  readonly tab: RecruitingTab;
  readonly children: ReactNode;
}

/**
 * Renders a Recruiting tab's content with the right gate: the locked state before
 * leadership is locked, a "no access" note for tabs the viewer can't use, then the
 * screen.
 */
export function RecruitingSection({ tab, children }: RecruitingSectionProps) {
  const { capabilities } = useRecruiting();
  if (!capabilities) return null;

  const access = capabilities.tabs[tab];

  if (!access.enabled) {
    if (capabilities.locked) return <LockedState />;
    return (
      <div className="flex flex-1 items-center justify-center py-16">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Lock className="size-4" aria-hidden />
          {access.reason}
        </p>
      </div>
    );
  }

  return children;
}
