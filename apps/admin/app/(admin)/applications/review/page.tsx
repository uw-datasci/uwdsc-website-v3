"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, Sheet, SheetContent, SheetTitle, useIsMobile } from "@uwdsc/ui";
import { toast } from "sonner";
import {
  ApplicationsError,
  ApplicationsLoading,
} from "@/components/applications";
import {
  ReviewHeader,
  ReviewDetail,
  ReviewList,
} from "@/components/applications/review";
import {
  getReviewApplications,
  updateApplicationReviewStatus,
} from "@/lib/api";
import {
  REVIEW_STATUS_LIST,
  VP_REVIEW_STATUS_LIST,
} from "@/constants/applications";
import type {
  ApplicationListItem,
  ApplicationReviewStatus,
} from "@uwdsc/common/types";

function withUpdatedSelectionStatus(
  application: ApplicationListItem,
  nextStatus: ApplicationReviewStatus,
): ApplicationListItem {
  return {
    ...application,
    position_selections: application.position_selections.map((selection) => ({
      ...selection,
      status: nextStatus,
    })),
  };
}

export default function ReviewPage() {
  const [applications, setApplications] = useState<ApplicationListItem[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<
    ApplicationListItem[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [scopeText, setScopeText] = useState<string>("your");
  const [isPresident, setIsPresident] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const isMobile = useIsMobile();
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const data = await getReviewApplications();

        setApplications(data.applications);
        setFilteredApplications(data.applications);
        setIsPresident(data.scope.isPresident);

        if (data.scope.isPresident) {
          setScopeText("all");
        } else if (data.scope.vpSubteamNames.length > 0) {
          setScopeText(data.scope.vpSubteamNames.join(", "));
        } else {
          setScopeText("your");
        }
      } catch (err) {
        console.error("Error fetching review applications:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load applications",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const selectedApplication = useMemo(
    () => applications.find((a) => a.id === selectedId) ?? null,
    [applications, selectedId],
  );

  const handleSelect = (id: string) => {
    setSelectedId(id);
    if (isMobile) setMobileDetailOpen(true);
  };

  const selectedReviewStatus =
    selectedApplication?.position_selections[0]?.status ?? null;
  const editableStatuses = isPresident
    ? REVIEW_STATUS_LIST
    : VP_REVIEW_STATUS_LIST;

  const handleStatusChange = async (nextStatus: ApplicationReviewStatus) => {
    if (!selectedApplication || selectedReviewStatus === nextStatus) return;

    try {
      setStatusUpdating(true);
      await updateApplicationReviewStatus(selectedApplication.id, nextStatus);
      setApplications((prev) =>
        prev.map((app) =>
          app.id === selectedApplication.id
            ? withUpdatedSelectionStatus(app, nextStatus)
            : app,
        ),
      );
      toast.success("Application status updated");
    } catch (err) {
      console.error("Error updating application status:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to update status",
      );
    } finally {
      setStatusUpdating(false);
    }
  };

  if (loading) return <ApplicationsLoading />;

  if (error) return <ApplicationsError message={error} />;

  return (
    <div className="mt-8 flex h-[calc(100vh-130px)] flex-col">
      <ReviewHeader
        applications={applications}
        scopeText={scopeText}
        onFilteredApplicationsChange={setFilteredApplications}
      />

      <div className="flex min-h-0 flex-1 gap-4">
        <Card className="w-full shrink-0 overflow-hidden p-0 md:w-[350px] md:min-w-[350px]">
          <ReviewList
            applications={filteredApplications}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </Card>

        <Card className="hidden flex-1 overflow-hidden p-0 md:flex">
          <ReviewDetail
            application={selectedApplication}
            statusOptions={editableStatuses}
            selectedStatus={selectedReviewStatus}
            statusUpdating={statusUpdating}
            onStatusChange={handleStatusChange}
          />
        </Card>

        <Sheet open={mobileDetailOpen} onOpenChange={setMobileDetailOpen}>
          <SheetContent
            side="bottom"
            className="h-[85vh] rounded-t-xl p-0 md:hidden"
          >
            <SheetTitle className="sr-only">Application Details</SheetTitle>
            <ReviewDetail
              application={selectedApplication}
              statusOptions={editableStatuses}
              selectedStatus={selectedReviewStatus}
              statusUpdating={statusUpdating}
              onStatusChange={handleStatusChange}
            />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
