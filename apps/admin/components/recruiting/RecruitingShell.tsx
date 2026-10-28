"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleHelp, Lock } from "lucide-react";
import {
  Button,
  Spinner,
  Tabs,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uwdsc/ui";
import { RECRUITING_TABS, type RecruitingTab } from "@uwdsc/common/recruiting";
import { formatTermCode } from "@uwdsc/common/utils";
import { useRecruiting } from "@/contexts/RecruitingContext";
import { TourProvider, useTour } from "./tour";

function activeTabFor(pathname: string): RecruitingTab {
  const match = RECRUITING_TABS.find(
    (tab) => tab.key !== "overview" && pathname.startsWith(tab.href)
  );
  return match?.key ?? "overview";
}

function TourButton() {
  const tour = useTour();
  if (!tour.available) return null;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          aria-label="Replay the tour"
          data-tour="help"
          onClick={tour.start}
        >
          <CircleHelp className="size-4" aria-hidden />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Replay the tour</TooltipContent>
    </Tooltip>
  );
}

/** Header, tab bar, guided tour and loading/error handling shared by every Recruiting page. */
export function RecruitingShell({ children }: { readonly children: ReactNode }) {
  return (
    <TourProvider>
      <ShellBody>{children}</ShellBody>
    </TourProvider>
  );
}

function ShellBody({ children }: { readonly children: ReactNode }) {
  const pathname = usePathname();
  const { capabilities, isLoading, error } = useRecruiting();
  const cycle = capabilities?.cycle ?? null;

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recruiting</h1>
          <p className="text-muted-foreground">
            {cycle ? `${formatTermCode(cycle.targetTermCode)} exec hiring` : "Exec hiring"}
          </p>
        </div>
        <TourButton />
      </div>

      {capabilities && (
        <Tabs value={activeTabFor(pathname)}>
          <TabsList variant="line" aria-label="Recruiting sections">
            {RECRUITING_TABS.map(({ key, label, href }) => {
              const access = capabilities.tabs[key];
              if (!access.visible) return null;

              if (access.enabled) {
                return (
                  <TabsTrigger key={key} value={key} asChild>
                    <Link href={href} data-tour={`tab-${key}`}>
                      {label}
                    </Link>
                  </TabsTrigger>
                );
              }

              return (
                <Tooltip key={key}>
                  <TooltipTrigger asChild>
                    <span tabIndex={0} className="inline-flex">
                      <TabsTrigger value={key} disabled>
                        <Lock className="size-3.5" aria-hidden />
                        {label}
                      </TabsTrigger>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>{access.reason}</TooltipContent>
                </Tooltip>
              );
            })}
          </TabsList>
        </Tabs>
      )}

      {isLoading && (
        <div className="flex flex-1 items-center justify-center py-24">
          <Spinner className="size-8" />
        </div>
      )}

      {error && !isLoading && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            Couldn&apos;t load Recruiting: {error.message}
          </p>
        </div>
      )}

      {capabilities && !isLoading && children}
    </div>
  );
}
