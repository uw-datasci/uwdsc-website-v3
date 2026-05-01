"use client";

import { useEffect, useState } from "react";
import { TeamOnboardingTable } from "@/components/onboarding";
import { getActiveTerm, getTeamOnboarding } from "@/lib/api/onboarding";
import type { OnboardingAdminRow, Term } from "@uwdsc/common/types";

export default function TeamOnboardingPage() {
  const [term, setTerm] = useState<Term | null>(null);
  const [rows, setRows] = useState<OnboardingAdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err) {
        const status = (err as { status?: number }).status;
        if (status === 401) {
          setError("Only presidents can view team onboarding.");
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

  if (loading) {
    return (
      <div className="space-y-4 mt-16 w-full">
        <h1 className="text-3xl font-bold">Team Onboarding</h1>
        <p className="text-muted-foreground">Loading onboarding data...</p>
      </div>
    );
  }

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
    <div className="space-y-6 w-full">
      <div className="my-8">
        <h1 className="text-3xl font-bold mb-2">Team Onboarding</h1>
        <p className="text-muted-foreground">
          {term ? `Viewing ${term.code} submissions.` : ""}
        </p>
      </div>

      <TeamOnboardingTable rows={rows} termId={term?.id ?? null} />
    </div>
  );
}
