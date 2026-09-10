"use client";

import { useState } from "react";
import { Loader2, Mail, MessageSquare, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import {
  Badge,
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@uwdsc/ui";
import { isAdmin } from "@uwdsc/common/constants";
import type { ContactSubmissionItem } from "@uwdsc/common/types";
import { resolveSupportSubmission } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface SupportDetailSheetProps {
  readonly submission: ContactSubmissionItem | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onRefresh: () => void;
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function SupportDetailSheet({
  submission,
  open,
  onOpenChange,
  onRefresh,
}: SupportDetailSheetProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canResolve = isAdmin(user?.role);

  if (!submission) return null;

  const isResolved = submission.resolved_at !== null;

  const handleToggleResolved = async () => {
    setIsSubmitting(true);
    try {
      await resolveSupportSubmission(submission.id, !isResolved);
      toast.success(isResolved ? "Submission reopened" : "Submission resolved");
      onOpenChange(false);
      onRefresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update submission");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{submission.subject}</SheetTitle>
          <SheetDescription>Received {formatDate(submission.created_at)}</SheetDescription>
        </SheetHeader>

        <div className="space-y-5 px-4 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={isResolved ? "secondary" : "outline"}>
              {isResolved ? "Resolved" : "Open"}
            </Badge>
            <Badge variant="outline" className="gap-1.5">
              {submission.source === "email" ? (
                <Mail className="size-3.5" />
              ) : (
                <MessageSquare className="size-3.5" />
              )}
              {submission.source === "email" ? "Email" : "Contact form"}
            </Badge>
          </div>

          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">From</p>
            <p className="text-sm font-medium">{submission.name}</p>
            <p className="text-sm text-muted-foreground">{submission.email}</p>
          </div>

          <div className="space-y-2 rounded-lg border border-border bg-muted/40 p-3">
            <pre className="max-h-96 overflow-auto whitespace-pre-wrap font-sans text-sm">
              {submission.message}
            </pre>
          </div>

          {isResolved && submission.resolver_name ? (
            <p className="text-xs text-muted-foreground">
              Resolved by {submission.resolver_name}
            </p>
          ) : null}

          {canResolve ? (
            <Button
              type="button"
              variant={isResolved ? "outline" : "default"}
              className="w-full"
              onClick={handleToggleResolved}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : isResolved ? (
                <RotateCcw className="size-4" />
              ) : null}
              {isResolved ? "Reopen" : "Mark resolved"}
            </Button>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
