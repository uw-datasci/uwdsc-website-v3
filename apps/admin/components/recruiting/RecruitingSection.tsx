"use client";

import { Lock } from "lucide-react";
import { RECRUITING_TABS, type RecruitingTab } from "@uwdsc/common/recruiting";
import { useRecruiting } from "@/contexts/RecruitingContext";
import { LockedState } from "./LockedState";

interface RecruitingSectionProps {
  readonly tab: RecruitingTab;
  /** GitHub issue that builds this screen (shown until it lands). */
  readonly issue: number;
}

/**
 * Renders a Recruiting tab's content with the right gate: the locked state before
 * leadership is locked, a "no access" note for tabs the viewer can't use, and a
 * placeholder until the screen itself is built.
 */
export function RecruitingSection({ tab, issue }: RecruitingSectionProps) {
  const { capabilities } = useRecruiting();
  if (!capabilities) return null;

  const access = capabilities.tabs[tab];
  const label = RECRUITING_TABS.find((t) => t.key === tab)?.label ?? tab;

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

  return (
    <div className="rounded-lg border border-dashed p-10 text-center">
      <p className="font-medium">{label} is coming soon</p>
      <p className="mt-1 text-sm text-muted-foreground">Tracked in #{issue}.</p>
    </div>
  );
}
