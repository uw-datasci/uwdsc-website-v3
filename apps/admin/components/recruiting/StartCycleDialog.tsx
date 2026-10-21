"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uwdsc/ui";
import { formatTermCode } from "@uwdsc/common/utils";
import { getStartableTerms, startRecruitingCycle, type StartableTerm } from "@/lib/api/recruiting";
import { useRecruiting } from "@/contexts/RecruitingContext";

interface StartCycleDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

/** President-only: pick the term being hired for and start the cycle. */
export function StartCycleDialog({ open, onOpenChange }: StartCycleDialogProps) {
  const { refresh } = useRecruiting();
  const [terms, setTerms] = useState<StartableTerm[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [targetTermId, setTargetTermId] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoadError(null);
    getStartableTerms()
      .then((result) => {
        if (cancelled) return;
        setTerms(result);
        setTargetTermId((current) => current || result[0]?.id || "");
      })
      .catch((err: unknown) => {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : "Failed to load terms");
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  const onStart = async () => {
    if (!targetTermId) return;
    setSubmitting(true);
    try {
      const cycle = await startRecruitingCycle(targetTermId);
      toast.success(`Started ${formatTermCode(cycle.targetTermCode)} exec hiring`);
      await refresh();
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to start the cycle");
    } finally {
      setSubmitting(false);
    }
  };

  const noTerms = terms !== null && terms.length === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start hiring cycle</DialogTitle>
          <DialogDescription>
            Pick the term you&apos;re hiring for. Next, you&apos;ll confirm who leads it.
          </DialogDescription>
        </DialogHeader>

        {loadError && <p className="text-sm text-destructive">{loadError}</p>}

        {noTerms && (
          <p className="text-sm text-muted-foreground">
            No upcoming term exists yet. Next term has to be added to the terms table before a
            cycle can start.
          </p>
        )}

        {terms && terms.length > 0 && (
          <div className="grid gap-2">
            <label htmlFor="target-term" className="text-sm font-medium">
              Hiring for
            </label>
            <Select value={targetTermId} onValueChange={setTargetTermId}>
              <SelectTrigger id="target-term" className="w-full">
                <SelectValue placeholder="Select a term" />
              </SelectTrigger>
              <SelectContent>
                {terms.map((term) => (
                  <SelectItem key={term.id} value={term.id}>
                    {formatTermCode(term.code)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={onStart} disabled={!targetTermId || submitting || noTerms}>
            {submitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            Start cycle
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
