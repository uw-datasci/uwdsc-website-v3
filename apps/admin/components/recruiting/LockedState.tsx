"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Crown, Lock } from "lucide-react";
import { Button } from "@uwdsc/ui";
import { formatTermCode } from "@uwdsc/common/utils";
import { useRecruiting } from "@/contexts/RecruitingContext";
import { StartCycleDialog } from "./StartCycleDialog";

/** Shown in place of a section until next term's leadership is locked. */
export function LockedState() {
  const { capabilities } = useRecruiting();
  const [startOpen, setStartOpen] = useState(false);
  if (!capabilities) return null;

  const { viewer, cycle, can } = capabilities;
  const targetLabel = cycle ? formatTermCode(cycle.targetTermCode) : "next term";

  if (viewer.role === "vp") {
    return (
      <LockedLayout
        icon={<Lock className="size-5" aria-hidden />}
        title="Recruiting opens soon"
        description={`Presidents are confirming next term's leadership. Once they lock it in, you'll be able to review candidates for ${viewer.subteamName ?? "your subteam"} here.`}
      />
    );
  }

  if (can.startCycle) {
    return (
      <>
        <LockedLayout
          icon={<Crown className="size-5" aria-hidden />}
          accent
          title="Recruiting is locked"
          description="Start a hiring cycle to begin. Pick the term you're hiring for, then confirm who leads it: presidents, each subteam's VPs, and which exec positions are hiring."
          action={
            <Button onClick={() => setStartOpen(true)}>
              Start hiring cycle
              <ArrowRight className="ml-2 size-4" aria-hidden />
            </Button>
          }
        />
        <StartCycleDialog open={startOpen} onOpenChange={setStartOpen} />
      </>
    );
  }

  return (
    <LockedLayout
      icon={<Crown className="size-5" aria-hidden />}
      accent
      title="Recruiting is locked"
      description={`Confirm who leads ${targetLabel} first: presidents, each subteam's VPs, and which exec positions are hiring. VPs see a waiting message until you do.`}
      action={
        <Button asChild>
          <Link href="/recruiting/leadership">
            Confirm next term&apos;s leadership
            <ArrowRight className="ml-2 size-4" aria-hidden />
          </Link>
        </Button>
      }
      footnote="Your co-president can finish it too."
    />
  );
}

interface LockedLayoutProps {
  readonly icon: React.ReactNode;
  readonly title: string;
  readonly description: string;
  readonly action?: React.ReactNode;
  readonly footnote?: string;
  readonly accent?: boolean;
}

function LockedLayout({ icon, title, description, action, footnote, accent }: LockedLayoutProps) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="flex max-w-md flex-col items-center text-center">
        <div
          className={
            accent
              ? "flex size-12 items-center justify-center rounded-xl bg-primary/15 text-primary"
              : "flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground"
          }
        >
          {icon}
        </div>
        <h2 className="mt-5 text-xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        {action && <div className="mt-6">{action}</div>}
        {footnote && <p className="mt-3 text-xs text-muted-foreground">{footnote}</p>}
      </div>
    </div>
  );
}
