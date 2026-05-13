"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, Sheet, SheetContent, SheetTitle, useIsMobile } from "@uwdsc/ui";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  ReturningExecList,
  ReturningExecDetail,
  ReturningExecsHeader,
} from "@/components/returning-execs";
import {
  getAllReturningExecs,
  updateReturningExecSelectionStatus,
} from "@/lib/api/returningExecs";
import type { ApplicationReviewStatus, ReturningExecListItem } from "@uwdsc/common/types";
import type { PositionReviewScopeDto } from "@/types/applications";
import { ApplicationsLoading, ApplicationsError } from "@/components/applications";

function withUpdatedSelection(
  submissions: ReturningExecListItem[],
  submissionId: string,
  selectionId: string,
  status: ApplicationReviewStatus,
): ReturningExecListItem[] {
  return submissions.map((sub) => {
    if (sub.id !== submissionId) return sub;
    return {
      ...sub,
      position_selections: sub.position_selections.map((s) =>
        s.id === selectionId ? { ...s, status } : s,
      ),
    };
  });
}

export default function ReturningExecsPage() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<ReturningExecListItem[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<ReturningExecListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [positionReview, setPositionReview] = useState<PositionReviewScopeDto | null>(null);
  const [updatingSelectionId, setUpdatingSelectionId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

  useEffect(() => {
    if (user && user.role !== "admin") {
      setError("Only admin users can access this page.");
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const { submissions: list, positionReview: pr } = await getAllReturningExecs();
        setSubmissions(list);
        setFilteredSubmissions(list);
        setPositionReview(pr);
      } catch (err) {
        console.error("Error fetching returning exec submissions:", err);
        setError(err instanceof Error ? err.message : "Failed to load submissions");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  const selectedSubmission = useMemo(
    () => submissions.find((s) => s.id === selectedId) ?? null,
    [submissions, selectedId],
  );

  const handleSelect = (id: string) => {
    setSelectedId(id);
    if (isMobile) setMobileDetailOpen(true);
  };

  const handleSelectionStatusChange = async (
    selectionId: string,
    status: ApplicationReviewStatus,
  ) => {
    if (!selectedSubmission) return;
    const selection = selectedSubmission.position_selections.find((s) => s.id === selectionId);
    if (!selection || selection.status === status) return;

    try {
      setUpdatingSelectionId(selectionId);
      await updateReturningExecSelectionStatus(selectionId, status);
      setSubmissions((prev) =>
        withUpdatedSelection(prev, selectedSubmission.id, selectionId, status),
      );
      toast.success("Status updated");
    } catch (err) {
      console.error("Error updating selection status:", err);
      toast.error(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setUpdatingSelectionId(null);
    }
  };

  if (loading) return <ApplicationsLoading />;
  if (error) return <ApplicationsError message={error} />;

  return (
    <div className="mt-8 flex flex-col h-[calc(100vh-130px)]">
      <ReturningExecsHeader
        submissions={submissions}
        onFilteredChange={setFilteredSubmissions}
      />

      <div className="flex gap-4 flex-1 min-h-0">
        <Card className="w-full md:w-[350px] md:min-w-[350px] shrink-0 overflow-hidden p-0">
          <ReturningExecList
            submissions={filteredSubmissions}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </Card>

        <Card className="hidden md:flex flex-1 overflow-hidden p-0">
          <ReturningExecDetail
            submission={selectedSubmission}
            positionReview={positionReview}
            onSelectionStatusChange={handleSelectionStatusChange}
            updatingSelectionId={updatingSelectionId}
          />
        </Card>

        <Sheet open={mobileDetailOpen} onOpenChange={setMobileDetailOpen}>
          <SheetContent side="bottom" className="md:hidden h-[85vh] p-0 rounded-t-xl">
            <SheetTitle className="sr-only">Submission Details</SheetTitle>
            <ReturningExecDetail
              submission={selectedSubmission}
              positionReview={positionReview}
              onSelectionStatusChange={handleSelectionStatusChange}
              updatingSelectionId={updatingSelectionId}
            />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
