"use client";

import { useCallback, useEffect, useState } from "react";
import { SubmissionsTable } from "@/components/memberships/submissions";
import { getMembershipSubmissions } from "@/lib/api";
import type { SubmissionReviewItem } from "@uwdsc/common/types";
import { Spinner } from "@uwdsc/ui";

export default function MembershipSubmissionsPage() {
  const [submissions, setSubmissions] = useState<SubmissionReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch every status: the table filters client-side so switching the
      // status filter doesn't re-mint every signed proof URL.
      setSubmissions(await getMembershipSubmissions());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load submissions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Membership submissions</h1>
        <p className="text-sm text-muted-foreground">
          Online proof-of-payment submissions awaiting review. Cash and MathSoc payments are
          verified from the Members page instead.
        </p>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner className="size-8" />
        </div>
      ) : null}

      {!loading && error ? <p className="text-sm text-destructive">{error}</p> : null}

      {!loading && !error ? (
        <SubmissionsTable submissions={submissions} onRefresh={fetchData} />
      ) : null}
    </div>
  );
}
