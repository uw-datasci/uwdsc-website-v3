"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { Info, MailX } from "lucide-react";
import {
  REJECTION_GROUP_LABELS,
  STATUS_LABELS,
  type RejectionGroup,
} from "@uwdsc/common/recruiting";
import type { RejectionBatchInput } from "@uwdsc/common/schemas";
import type { RejectionBatchPreview } from "@uwdsc/common/types";
import {
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Spinner,
  Switch,
} from "@uwdsc/ui";
import { STATUS_TONES } from "@/constants/recruiting";
import { useRefreshDecisions } from "@/hooks/useOfferActions";
import { previewRejectionBatch, sendRejectionBatch } from "@/lib/api";
import { EmailPreviewFrame } from "./EmailPreviewFrame";

const GROUPS: { key: RejectionGroup; tone: string; description: string }[] = [
  {
    key: "notWanted",
    tone: STATUS_TONES["Not Wanted"].badge,
    description: "A VP passed on them for every position they applied to.",
  },
  {
    key: "inReview",
    tone: STATUS_TONES["In Review"].badge,
    description: "Still in In Review. No one moved them before review closed.",
  },
  {
    key: "interviewing",
    tone: STATUS_TONES.Interviewing.badge,
    description: "Interviewed but no decision yet. Usually best to wait for their VP.",
  },
];

const VISIBLE_ROWS = 50;

export function RejectBatchDialog({
  open,
  onOpenChange,
}: {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-2xl">
        {open && <RejectBatchBody onClose={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}

function RejectBatchBody({ onClose }: { onClose: () => void }) {
  const refresh = useRefreshDecisions();
  const [include, setInclude] = useState<RejectionBatchInput["include"]>({
    notWanted: true,
    inReview: true,
    interviewing: false,
  });
  const [showEmail, setShowEmail] = useState(false);
  const [sending, setSending] = useState(false);
  const { data, error, isLoading } = useSWR<RejectionBatchPreview, Error>(
    ["rejection-batch-preview", include.notWanted, include.inReview, include.interviewing],
    () => previewRejectionBatch({ include }),
    { revalidateOnFocus: false, shouldRetryOnError: false, keepPreviousData: true }
  );

  const count = data?.recipients.length ?? 0;
  const send = async () => {
    setSending(true);
    try {
      const { sent } = await sendRejectionBatch({ include });
      toast.success(`Sent ${sent} rejection${sent === 1 ? "" : "s"}`);
      await refresh();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't send the rejections");
      await refresh();
    } finally {
      setSending(false);
    }
  };

  const example = data?.skippedExample;

  return (
    <>
      <DialogHeader>
        <DialogTitle>Send rejections</DialogTitle>
        <DialogDescription>
          Choose who gets the rejection email. Anyone who is Wanted or has an offer for another
          position is skipped automatically.
        </DialogDescription>
      </DialogHeader>

      <div className="overflow-hidden rounded-lg border">
        {GROUPS.map((group) => (
          <label
            key={group.key}
            className="flex cursor-pointer items-center gap-3 border-b px-3.5 py-3"
          >
            <Switch
              checked={include[group.key]}
              onCheckedChange={(checked) =>
                setInclude((current) => ({ ...current, [group.key]: checked }))
              }
              aria-label={REJECTION_GROUP_LABELS[group.key]}
            />
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span
                  className={cn("rounded px-1.5 text-xs leading-5 font-semibold", group.tone)}
                >
                  {REJECTION_GROUP_LABELS[group.key]}
                </span>
                <span className="text-[13px] text-muted-foreground">
                  {data?.counts[group.key] ?? "…"} candidates
                </span>
              </span>
              <span className="mt-1 block text-xs text-muted-foreground">
                {group.description}
              </span>
            </span>
          </label>
        ))}
        {data && data.skipped > 0 && (
          <p className="flex items-center gap-2 px-3.5 py-2.5 text-xs text-muted-foreground">
            <Info className="size-3.5 flex-none" aria-hidden />
            {data.skipped} skipped because they&apos;re Wanted or offered elsewhere
            {example
              ? `, like ${example.name} (${STATUS_LABELS[example.status]} for ${example.positionName})`
              : ""}
            .
          </p>
        )}
      </div>

      <div className="flex items-baseline gap-2.5">
        <span className="text-3xl font-semibold tracking-tight tabular-nums">{count}</span>
        <span className="text-sm font-medium">recipient{count === 1 ? "" : "s"}</span>
        {isLoading && <Spinner className="size-4" />}
        <Button
          variant="link"
          size="sm"
          className="ml-auto h-auto p-0 text-[13px] text-muted-foreground"
          disabled={!data?.email}
          onClick={() => setShowEmail((value) => !value)}
        >
          {showEmail ? "Show recipients" : "Preview email"}
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error.message}</p>}

      {showEmail ? (
        <EmailPreviewFrame
          html={data?.email?.html ?? null}
          subject={data?.email?.subject ?? null}
          loading={isLoading}
          error={null}
        />
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_8rem] gap-3 border-b bg-muted/40 px-3.5 py-2 text-xs font-medium text-muted-foreground">
            <span>Candidate</span>
            <span>Applied for</span>
            <span>Reason</span>
          </div>
          <ul className="max-h-72 overflow-y-auto">
            {data?.recipients.slice(0, VISIBLE_ROWS).map((recipient) => (
              <li
                key={recipient.applicationId}
                className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_8rem] items-center gap-3 border-b px-3.5 py-2 text-[13px] last:border-b-0"
              >
                <span className="min-w-0">
                  <span className="block font-medium">{recipient.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {recipient.email}
                  </span>
                </span>
                <span className="truncate text-muted-foreground">
                  {recipient.positionNames.join(", ")}
                </span>
                <span>
                  <span
                    className={cn(
                      "rounded px-1.5 py-px text-xs font-medium whitespace-nowrap",
                      GROUPS.find((group) => group.key === recipient.group)?.tone
                    )}
                  >
                    {REJECTION_GROUP_LABELS[recipient.group]}
                  </span>
                </span>
              </li>
            ))}
            {count === 0 && !isLoading && (
              <li className="px-3.5 py-6 text-center text-sm text-muted-foreground">
                No one matches these groups.
              </li>
            )}
          </ul>
          {count > VISIBLE_ROWS && (
            <div className="bg-muted/40 px-3.5 py-2 text-xs text-muted-foreground">
              and {count - VISIBLE_ROWS} more
            </div>
          )}
        </div>
      )}

      <DialogFooter className="items-center gap-2 border-t pt-4 sm:justify-between">
        <span className="text-xs text-muted-foreground">
          Emails can&apos;t be unsent. Each card moves to Rejection Sent.
        </span>
        <div className="flex gap-2">
          <Button variant="outline" disabled={sending} onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={sending || count === 0} onClick={() => void send()}>
            {sending ? <Spinner className="size-4" /> : <MailX aria-hidden />}
            Send {count} rejection{count === 1 ? "" : "s"}
          </Button>
        </div>
      </DialogFooter>
    </>
  );
}
