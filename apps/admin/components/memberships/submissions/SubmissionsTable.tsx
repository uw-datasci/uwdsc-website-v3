"use client";
"use no memo";

import { useMemo, useState } from "react";
import { Mail, Receipt } from "lucide-react";
import { toast } from "sonner";
import {
  Badge,
  Button,
  Card,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@uwdsc/ui";
import { reviewMembershipSubmission } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { SubmissionReviewItem, SubmissionStatus } from "@uwdsc/common/types";
import { RejectSubmissionModal } from "./RejectSubmissionModal";
import { SubmissionReviewDrawer } from "./SubmissionReviewDrawer";

interface SubmissionsTableProps {
  readonly submissions: SubmissionReviewItem[];
  readonly onRefresh: () => void;
}

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "all", label: "All" },
] as const;

const STATUS_VARIANT: Record<SubmissionStatus, "outline" | "secondary" | "destructive"> = {
  pending: "outline",
  approved: "secondary",
  rejected: "destructive",
};

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function SubmissionsTable({ submissions, onRefresh }: SubmissionsTableProps) {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<SubmissionReviewItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return submissions.filter((submission) => {
      if (statusFilter !== "all" && submission.status !== statusFilter) return false;
      if (!query) return true;

      return [
        submission.first_name,
        submission.last_name,
        submission.wat_iam,
        submission.contact_email,
        submission.profile_email,
      ]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(query));
    });
  }, [submissions, statusFilter, search]);

  const isSelf = selected?.profile_id === user?.id;

  const handleApprove = async () => {
    if (!selected) return;
    setIsSubmitting(true);
    try {
      await reviewMembershipSubmission(selected.id, { decision: "approved" });
      toast.success("Submission approved");
      setDrawerOpen(false);
      onRefresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to approve");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (reason: string) => {
    if (!selected) return;
    try {
      await reviewMembershipSubmission(selected.id, { decision: "rejected", reason });
      toast.success("Submission rejected");
      setDrawerOpen(false);
      onRefresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to reject");
      throw error;
    }
  };

  return (
    <Card className="p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name, WatIAM or email…"
          className="sm:max-w-xs"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground sm:ml-auto">
          {filtered.length} submission{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>WatIAM</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead className="text-right">Review</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                No submissions.
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell>
                  <div className="font-medium">
                    {submission.first_name} {submission.last_name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {submission.contact_email}
                  </div>
                </TableCell>
                <TableCell>{submission.wat_iam || "—"}</TableCell>
                <TableCell>
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    {submission.source === "email" ? (
                      <Mail className="size-3.5" />
                    ) : (
                      <Receipt className="size-3.5" />
                    )}
                    {submission.source === "email" ? "Email" : "Form"}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[submission.status]} className="capitalize">
                    {submission.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(submission.submitted_at)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelected(submission);
                      setDrawerOpen(true);
                    }}
                  >
                    Review
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <SubmissionReviewDrawer
        submission={selected}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onApprove={handleApprove}
        onReject={() => setRejectOpen(true)}
        isSelf={isSelf}
        isSubmitting={isSubmitting}
      />

      <RejectSubmissionModal
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        memberName={`${selected?.first_name ?? ""} ${selected?.last_name ?? ""}`.trim()}
        onConfirm={handleReject}
      />
    </Card>
  );
}
