"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Card,
  Sheet,
  SheetContent,
  SheetTitle,
  useIsMobile,
} from "@uwdsc/ui";

import {
  ApplicationList,
  ApplicationDetail,
  ApplicationsLoading,
  ApplicationsError,
  ApplicationsHeader,
} from "@/components/applications";
import { getAllApplications } from "@/lib/api";
import type { ApplicationListItem } from "@uwdsc/common/types";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationListItem[]>([]);
  const [statusCounts, setStatusCounts] = useState({
    draft: 0,
    submitted: 0,
  });
  const [filteredApplications, setFilteredApplications] = useState<
    ApplicationListItem[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const { applications: list, statusCounts } = await getAllApplications();
        setApplications(list);
        setStatusCounts(statusCounts);
        setFilteredApplications(list);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load applications",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Currently selected application
  const selectedApplication = useMemo(
    () => applications.find((a) => a.id === selectedId) ?? null,
    [applications, selectedId],
  );

  // Handle selection — open sheet on mobile only
  const handleSelect = (id: string) => {
    setSelectedId(id);
    if (isMobile) setMobileDetailOpen(true);
  };

  if (loading) return <ApplicationsLoading />;
  if (error) return <ApplicationsError message={error} />;

  return (
    <div className="mt-8 flex flex-col h-[calc(100vh-130px)]">
      <ApplicationsHeader
        applications={applications}
        statusCounts={statusCounts}
        onFilteredApplicationsChange={setFilteredApplications}
      />

      {/* Master-detail layout */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Left panel – application list */}
        <Card className="w-full md:w-[350px] md:min-w-[350px] shrink-0 overflow-hidden p-0">
          <ApplicationList
            applications={filteredApplications}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </Card>

        {/* Right panel – detail (desktop only) */}
        <Card className="hidden md:flex flex-1 overflow-hidden p-0">
          <ApplicationDetail application={selectedApplication} />
        </Card>

        {/* Mobile detail – Sheet drawer */}
        <Sheet open={mobileDetailOpen} onOpenChange={setMobileDetailOpen}>
          <SheetContent
            side="bottom"
            className="md:hidden h-[85vh] p-0 rounded-t-xl"
          >
            <SheetTitle className="sr-only">Application Details</SheetTitle>
            <ApplicationDetail application={selectedApplication} />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
