"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Card,
  Input,
  Skeleton,
  Sheet,
  SheetContent,
  SheetTitle,
  useIsMobile,
} from "@uwdsc/ui";

import { Search } from "lucide-react";
import { ApplicationList, ApplicationDetail } from "@/components/applications";
import { getAllApplications } from "@/lib/api";
import type { ApplicationListItem } from "@uwdsc/common/types";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [positionFilter, setPositionFilter] = useState<string>("all");
  const [nameSearch, setNameSearch] = useState("");
  const isMobile = useIsMobile();
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllApplications();
        setApplications(data);
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

  // Extract unique position names for filter
  const positionOptions = useMemo(() => {
    const names = new Set<string>();
    for (const app of applications) {
      for (const sel of app.position_selections) {
        names.add(sel.position_name);
      }
    }
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [applications]);

  // Filter applications by selected position and name search
  const filteredApplications = useMemo(() => {
    const query = nameSearch.trim().toLowerCase();
    return applications.filter((app) => {
      const matchesPosition =
        positionFilter === "all" ||
        app.position_selections.some(
          (sel) => sel.position_name === positionFilter,
        );
      const matchesName = !query || app.full_name.toLowerCase().includes(query);
      return matchesPosition && matchesName;
    });
  }, [applications, positionFilter, nameSearch]);

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

  if (loading) {
    return (
      <div className="space-y-4 mt-8 w-full">
        <h1 className="text-3xl font-bold">Applications</h1>
        <p className="text-muted-foreground">Loading applications...</p>
        <div className="flex gap-4 h-[calc(100vh-220px)]">
          <Skeleton className="w-full md:w-[350px] h-full rounded-lg" />
          <Skeleton className="hidden md:block flex-1 h-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 mt-8 w-full">
        <h1 className="text-3xl font-bold">Applications</h1>
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-sm text-destructive">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col h-[calc(100vh-130px)]">
      {/* Header */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold mb-1">Applications</h1>
          <p className="text-sm text-muted-foreground">
            {filteredApplications.length} application
            {filteredApplications.length === 1 ? "" : "s"}
            {positionFilter !== "all" && (
              <span>
                {" "}
                for <span className="font-medium">{positionFilter}</span>
              </span>
            )}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-end gap-3">
          {/* Name search */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">
              Search
            </span>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search by name…"
                value={nameSearch}
                onChange={(e) => setNameSearch(e.target.value)}
                className="h-8 pl-8 w-52"
              />
            </div>
          </div>

          {/* Position filter */}
          {positionOptions.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">
                Position
              </span>
              <Select value={positionFilter} onValueChange={setPositionFilter}>
                <SelectTrigger className="h-8 w-48">
                  <SelectValue placeholder="Filter by position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Positions</SelectItem>
                  {positionOptions.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

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
