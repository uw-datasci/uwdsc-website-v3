"use client";

import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, ExternalLink, FileText, X } from "lucide-react";
import { STATUS_LABELS, type SelectionStatus } from "@uwdsc/common/recruiting";
import type { BoardCard, CandidateView } from "@uwdsc/common/types";
import {
  Button,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  Spinner,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@uwdsc/ui";
import { useRecruiting } from "@/contexts/RecruitingContext";
import { BOARD_KEY } from "@/hooks/useBoard";
import { getCandidate, getCandidateResumeUrl } from "@/lib/api";
import { externalUrl, programLine } from "@/lib/utils/recruiting";
import { PersonAvatar } from "../leadership/PersonAvatar";
import { ACTIVITY_KEY, ActivityTab } from "./ActivityTab";
import { ApplicationTab } from "./ApplicationTab";
import { DecisionFooter } from "./DecisionFooter";
import { NotesTab } from "./NotesTab";
import { PositionsStrip } from "./PositionsStrip";

interface CandidateDrawerProps {
  /** The opened card, or null when closed. */
  readonly card: BoardCard | null;
  /** All of the candidate's cards, by priority. */
  readonly siblings: readonly BoardCard[];
  /** Visible cards in the opened card's column, for prev/next. */
  readonly column: readonly BoardCard[];
  readonly conflict: boolean;
  readonly onNavigate: (card: BoardCard) => void;
  readonly onClose: () => void;
  readonly onMove: (card: BoardCard, to: SelectionStatus) => Promise<void>;
}

export function CandidateDrawer({
  card,
  siblings,
  column,
  conflict,
  onNavigate,
  onClose,
  onMove,
}: CandidateDrawerProps) {
  const [tab, setTab] = useState("application");
  const { capabilities } = useRecruiting();
  const { data, error, isLoading } = useSWR<CandidateView, Error>(
    card ? ["/api/recruiting/candidates", card.applicationId] : null,
    ([, applicationId]: [string, string]) => getCandidate(applicationId),
    { shouldRetryOnError: false }
  );

  const { mutate } = useSWRConfig();
  const refreshActivity = () => {
    if (card) void mutate([ACTIVITY_KEY, card.applicationId]);
  };
  const moveCard = async (target: BoardCard, to: SelectionStatus) => {
    await onMove(target, to);
    refreshActivity();
  };
  const onNotesChanged = () => {
    void mutate(BOARD_KEY);
    refreshActivity();
  };

  const index = card ? column.findIndex((other) => other.id === card.id) : -1;
  const prev = index > 0 ? column[index - 1] : undefined;
  const next = index >= 0 ? column[index + 1] : undefined;

  const openResume = async () => {
    if (!card) return;
    // Open the tab now so the browser doesn't block it after the await.
    const tabRef = window.open("about:blank", "_blank");
    if (tabRef) tabRef.opener = null;
    try {
      const url = await getCandidateResumeUrl(card.applicationId);
      if (url && tabRef) {
        tabRef.location.href = url;
        return;
      }
      tabRef?.close();
      if (!url) toast.info("No resume uploaded");
    } catch (err) {
      tabRef?.close();
      toast.error(err instanceof Error ? err.message : "Couldn't open the resume");
    }
  };

  const links = data
    ? [
        { label: "LinkedIn", url: data.linkedinUrl },
        { label: "GitHub", url: data.githubUrl },
        { label: "Portfolio", url: data.portfolioUrl },
      ].filter((link): link is { label: string; url: string } => !!link.url)
    : [];
  const name = data?.name ?? card?.name ?? "";
  const description = [data?.email ?? card?.email, card && programLine(card), data?.location]
    .filter(Boolean)
    .join(" · ");
  const appliedOn = data
    ? new Date(data.submittedAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <Sheet open={card !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full gap-0 p-0 sm:max-w-xl"
      >
        {card && (
          <>
            <header className="flex flex-col gap-3 border-b px-5 pt-3 pb-4">
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  aria-label="Previous candidate"
                  disabled={!prev}
                  onClick={() => prev && onNavigate(prev)}
                >
                  <ChevronUp className="size-4" aria-hidden />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  aria-label="Next candidate"
                  disabled={!next}
                  onClick={() => next && onNavigate(next)}
                >
                  <ChevronDown className="size-4" aria-hidden />
                </Button>
                {index >= 0 && (
                  <span className="ml-1 text-xs text-muted-foreground tabular-nums">
                    {index + 1} of {column.length} in {STATUS_LABELS[card.status]}
                  </span>
                )}
                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto size-7"
                    aria-label="Close"
                  >
                    <X className="size-4" aria-hidden />
                  </Button>
                </SheetClose>
              </div>

              <div className="flex items-center gap-3">
                <PersonAvatar name={name} className="size-11 text-sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <SheetTitle className="text-lg">{name}</SheetTitle>
                    {card.returning && (
                      <span className="rounded px-1.5 py-px text-[11px] leading-4 font-medium ring-1 ring-border ring-inset">
                        Returning
                      </span>
                    )}
                    {conflict && (
                      <span className="rounded bg-amber-100 px-1.5 py-px text-[11px] leading-4 font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-200">
                        Conflict
                      </span>
                    )}
                  </div>
                  <SheetDescription className="truncate text-[13px]">
                    {description}
                  </SheetDescription>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                <Button variant="outline" size="sm" className="h-7" onClick={openResume}>
                  <FileText aria-hidden />
                  Resume
                </Button>
                {links.map((link) => (
                  <Button key={link.label} variant="outline" size="sm" className="h-7" asChild>
                    <a href={externalUrl(link.url)} target="_blank" rel="noopener noreferrer">
                      <ExternalLink aria-hidden />
                      {link.label}
                    </a>
                  </Button>
                ))}
              </div>
            </header>

            <PositionsStrip cards={siblings} appliedOn={appliedOn} onMove={moveCard} />

            <Tabs value={tab} onValueChange={setTab} className="min-h-0 flex-1 gap-0">
              <TabsList variant="line" className="w-full justify-start border-b px-5">
                <TabsTrigger value="application">Application</TabsTrigger>
                <TabsTrigger value="notes">
                  Notes
                  {card.noteCount > 0 && (
                    <span className="rounded-full bg-muted px-1.5 text-[11px] leading-4 tabular-nums">
                      {card.noteCount}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
                <TabsContent value="application">
                  {isLoading && (
                    <div className="flex justify-center py-16">
                      <Spinner className="size-6" />
                    </div>
                  )}
                  {error && (
                    <p className="text-sm text-destructive">
                      Couldn&apos;t load the application: {error.message}
                    </p>
                  )}
                  {data && <ApplicationTab candidate={data} />}
                </TabsContent>
                <TabsContent value="notes">
                  <NotesTab applicationId={card.applicationId} onChanged={onNotesChanged} />
                </TabsContent>
                <TabsContent value="activity">
                  <ActivityTab applicationId={card.applicationId} />
                </TabsContent>
              </div>
            </Tabs>

            {capabilities?.can.sendOffers && <DecisionFooter cards={siblings} />}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
