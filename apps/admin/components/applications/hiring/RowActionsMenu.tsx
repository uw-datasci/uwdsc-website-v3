"use client";

import { useCallback, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Ban, CheckCircle2, MoreVertical, Send, XCircle } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@uwdsc/ui";
import type { ApplicationReviewStatus } from "@uwdsc/common/types";
import {
  getHiringStatusOptions,
  HIRING_ROW_ACTION_ORDER,
  HIRING_ROW_ACTION_CANCEL_LABEL,
  HIRING_ROW_ACTION_CONFIRM_COPY,
  HIRING_ROW_ACTION_DROPDOWN_CONTENT_CLASS,
  HIRING_ROW_ACTION_MENU_LABEL,
  HIRING_ROW_ACTION_WORKING_LABEL,
  type HiringRowActionStatus,
} from "@/constants/applications";

const ROW_ACTION_ICONS: Record<HiringRowActionStatus, LucideIcon> = {
  "Offer Sent": Send,
  "Rejection Sent": Ban,
  "Accepted Offer": CheckCircle2,
  "Declined Offer": XCircle,
};

const MENU_ITEMS = HIRING_ROW_ACTION_ORDER.map((status) => ({
  status,
  label: HIRING_ROW_ACTION_MENU_LABEL[status],
  Icon: ROW_ACTION_ICONS[status],
}));

interface ApplicantRowActionsMenuProps {
  selectionId: string;
  selectionStatus: ApplicationReviewStatus;
  applicantName: string;
  roleLabel: string;
  disabled?: boolean;
  onConfirmStatus: (
    selectionId: string,
    status: ApplicationReviewStatus,
  ) => Promise<void>;
}

export function ApplicantRowActionsMenu({
  selectionId,
  selectionStatus,
  applicantName,
  roleLabel,
  disabled,
  onConfirmStatus,
}: Readonly<ApplicantRowActionsMenuProps>) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pending, setPending] = useState<HiringRowActionStatus | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const visibleMenuItems = useMemo(() => {
    const allowed = new Set(getHiringStatusOptions(selectionStatus));
    return MENU_ITEMS.filter((item) => allowed.has(item.status));
  }, [selectionStatus]);

  const copy = useMemo(
    () => (pending ? HIRING_ROW_ACTION_CONFIRM_COPY[pending] : null),
    [pending],
  );

  const openConfirm = useCallback((status: HiringRowActionStatus) => {
    setPending(status);
    setDialogOpen(true);
  }, []);

  const handleDialogOpenChange = useCallback((open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setPending(null);
      setSubmitting(false);
    }
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!pending) return;
    setSubmitting(true);
    try {
      await onConfirmStatus(selectionId, pending);
      setDialogOpen(false);
      setPending(null);
    } finally {
      setSubmitting(false);
    }
  }, [onConfirmStatus, pending, selectionId]);

  if (visibleMenuItems.length === 0) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8 shrink-0"
        disabled
        aria-label={`No actions for status ${selectionStatus}`}
      >
        <MoreVertical className="size-4 opacity-40" aria-hidden />
      </Button>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 shrink-0"
            disabled={disabled}
            aria-label={`Actions for ${applicantName}, ${roleLabel}`}
          >
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className={HIRING_ROW_ACTION_DROPDOWN_CONTENT_CLASS}
        >
          {visibleMenuItems.map(({ status, label, Icon }) => (
            <DropdownMenuItem
              key={status}
              variant={
                HIRING_ROW_ACTION_CONFIRM_COPY[status].destructive
                  ? "destructive"
                  : "default"
              }
              onSelect={() => openConfirm(status)}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent showCloseButton={!submitting}>
          {copy ? (
            <>
              <DialogHeader>
                <DialogTitle>{copy.title}</DialogTitle>
                <DialogDescription>
                  {copy.description}
                  <span className="mt-2 block text-foreground">
                    {applicantName} — {roleLabel}
                  </span>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  disabled={submitting}
                  onClick={() => handleDialogOpenChange(false)}
                >
                  {HIRING_ROW_ACTION_CANCEL_LABEL}
                </Button>
                <Button
                  type="button"
                  variant={copy.destructive ? "destructive" : "default"}
                  disabled={submitting}
                  onClick={() => void handleConfirm()}
                >
                  {submitting
                    ? HIRING_ROW_ACTION_WORKING_LABEL
                    : copy.confirmLabel}
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
