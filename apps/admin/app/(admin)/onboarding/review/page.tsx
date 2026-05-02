"use client";

import { useEffect, useState } from "react";
import { Card, Sheet, SheetContent, SheetTitle, useIsMobile } from "@uwdsc/ui";
import { getActiveTerm, getTeamOnboarding } from "@/lib/api/onboarding";
import type { OnboardingAdminRow, Term } from "@uwdsc/common/types";
import {
  OnboardingLoading,
  OnboardingHeader,
  OnboardingList,
  OnboardingDetail,
} from "@/components/onboarding";

export default function TeamOnboardingPage() {
  const [term, setTerm] = useState<Term | null>(null);
  const [rows, setRows] = useState<OnboardingAdminRow[]>([]);
  const [filteredRows, setFilteredRows] = useState<OnboardingAdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const currentTerm = await getActiveTerm();
        if (!currentTerm) {
          setError("No active term found");
          return;
        }
        setTerm(currentTerm);
        const data = await getTeamOnboarding(currentTerm.id);
        setRows(data);
        setFilteredRows(data);
      } catch (err) {
        const status = (err as { status?: number }).status;
        if (status === 401) {
          setError((err as Error).message);
          return;
        }
        setError(
          err instanceof Error ? err.message : "Failed to load onboarding data",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const selectedRow = rows.find((r) => r.profile_id === selectedId) ?? null;

  const handleSelect = (id: string) => {
    setSelectedId(id);
    if (isMobile) setMobileDetailOpen(true);
  };

  if (loading) return <OnboardingLoading />;

  if (error) {
    return (
      <div className="space-y-4 mt-16 w-full">
        <h1 className="text-3xl font-bold">Team Onboarding</h1>
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-sm text-destructive">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col h-[calc(100vh-130px)]">
      <OnboardingHeader
        rows={rows}
        term={term}
        termId={term?.id ?? null}
        onFilteredRowsChange={setFilteredRows}
      />

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Left panel – list */}
        <Card className="w-full md:w-[350px] md:min-w-[350px] shrink-0 overflow-hidden p-0">
          <OnboardingList
            rows={filteredRows}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </Card>

        {/* Right panel – detail (desktop) */}
        <Card className="hidden md:flex flex-1 overflow-hidden p-0">
          <OnboardingDetail row={selectedRow} />
        </Card>

        {/* Mobile – Sheet */}
        <Sheet open={mobileDetailOpen} onOpenChange={setMobileDetailOpen}>
          <SheetContent
            side="bottom"
            className="md:hidden h-[85vh] p-0 rounded-t-xl"
          >
            <SheetTitle className="sr-only">Onboarding Details</SheetTitle>
            <OnboardingDetail row={selectedRow} />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
