"use client";

import { useState } from "react";
import { useSWRConfig } from "swr";
import { toast } from "sonner";
import { CircleCheckBig, Globe, GraduationCap, TriangleAlert, UserPlus } from "lucide-react";
import { finalizeSchema } from "@uwdsc/common/schemas";
import type { FinalizeView } from "@uwdsc/common/types";
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Spinner,
} from "@uwdsc/ui";
import { useRecruiting } from "@/contexts/RecruitingContext";
import { BOARD_KEY } from "@/hooks/useBoard";
import { finalizeCycle, FINALIZE_KEY, OFFERS_KEY } from "@/lib/api";
import { joinNames } from "@uwdsc/common/utils";

interface FinalizeDialogProps {
  readonly view: FinalizeView;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

export function FinalizeDialog({ view, open, onOpenChange }: FinalizeDialogProps) {
  const { refresh } = useRecruiting();
  const { mutate } = useSWRConfig();
  const [link, setLink] = useState("");
  const [checked, setChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const linkCheck = finalizeSchema.safeParse({ when2MeetLink: link.trim() });

  const submit = async () => {
    if (!linkCheck.success) return;
    setSubmitting(true);
    try {
      const result = await finalizeCycle(linkCheck.data);
      toast.success(
        `${view.targetTermLabel} team finalized${result.welcomeSent ? " and welcome email sent" : ""}`
      );
      if (!result.welcomeSent)
        toast.warning("The welcome email didn't send. Send it from Campaigns.");
      await Promise.all([
        refresh(),
        mutate(FINALIZE_KEY),
        mutate(BOARD_KEY),
        mutate(OFFERS_KEY),
      ]);
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't finalize the team");
    } finally {
      setSubmitting(false);
    }
  };

  const items = [
    {
      icon: UserPlus,
      text: (
        <>
          <strong className="font-semibold">
            {view.newExecs.length} new exec{view.newExecs.length === 1 ? "" : "s"}
          </strong>{" "}
          and {view.returning.length} returning get their exec roles for {view.targetTermLabel}.
        </>
      ),
    },
    {
      icon: GraduationCap,
      text: (
        <>
          <strong className="font-semibold">
            {view.leaving.length} member{view.leaving.length === 1 ? "" : "s"} become alum
          </strong>{" "}
          and lose exec access.
        </>
      ),
    },
    {
      icon: Globe,
      text: (
        <>
          The <strong className="font-semibold">team page</strong> on the website switches to
          the new team.
        </>
      ),
    },
  ];

  return (
    <Dialog open={open} onOpenChange={(next) => !submitting && onOpenChange(next)}>
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Finalize the {view.targetTermLabel} team?</DialogTitle>
          <DialogDescription>
            This switches everyone over at once. You can&apos;t undo it from Recruiting.
          </DialogDescription>
        </DialogHeader>

        <ul className="flex flex-col gap-3">
          {items.map(({ icon: Icon, text }, index) => (
            <li key={index} className="flex gap-3 text-sm">
              <span
                aria-hidden
                className="flex size-7 flex-none items-center justify-center rounded-lg bg-muted"
              >
                <Icon className="size-3.5" />
              </span>
              <span className="pt-1">{text}</span>
            </li>
          ))}
        </ul>

        {view.pending.length > 0 && (
          <p className="flex gap-2.5 rounded-lg bg-amber-50 px-3 py-2.5 text-[13px] text-amber-900 ring-1 ring-amber-200 ring-inset dark:bg-amber-950 dark:text-amber-200 dark:ring-amber-900">
            <TriangleAlert className="mt-0.5 size-3.5 flex-none" aria-hidden />
            <span>
              <strong className="font-semibold">
                {view.pending.length} unanswered offer
                {view.pending.length === 1 ? " closes" : "s close"}.
              </strong>{" "}
              {joinNames(view.pending.map((offer) => offer.name))} get an email saying the offer
              has closed.
            </span>
          </p>
        )}

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="finalize-when2meet">All-hands When2Meet link</Label>
          <Input
            id="finalize-when2meet"
            type="url"
            placeholder="https://www.when2meet.com/..."
            value={link}
            onChange={(event) => setLink(event.target.value)}
          />
          <span className="text-xs text-muted-foreground">
            Goes in the welcome email to the new team.
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <Checkbox
            id="finalize-checked"
            checked={checked}
            onCheckedChange={(value) => setChecked(value === true)}
          />
          <Label htmlFor="finalize-checked" className="text-[13px] font-normal">
            I checked the team page preview
          </Label>
        </div>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" disabled={submitting} onClick={() => onOpenChange(false)}>
            {view.pending.length > 0 ? "Wait for replies" : "Cancel"}
          </Button>
          <Button
            disabled={submitting || !checked || !linkCheck.success}
            onClick={() => void submit()}
          >
            {submitting ? <Spinner className="size-4" /> : <CircleCheckBig aria-hidden />}
            Finalize team
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
