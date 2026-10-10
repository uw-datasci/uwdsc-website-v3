"use client";

import { useCallback, useEffect, useState } from "react";
import { SupportTable } from "@/components/support";
import { getSupportSubmissions } from "@/lib/api";
import type { ContactSubmissionItem } from "@uwdsc/common/types";
import { Spinner } from "@uwdsc/ui";

export default function SupportPage() {
  const [submissions, setSubmissions] = useState<ContactSubmissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setSubmissions(await getSupportSubmissions());
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
        <h1 className="text-2xl font-bold">Support</h1>
        <p className="text-sm text-muted-foreground">
          Messages from the contact form and support@mail.uwdatascience.ca.
        </p>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner className="size-8" />
        </div>
      ) : null}

      {!loading && error ? <p className="text-sm text-destructive">{error}</p> : null}

      {!loading && !error ? (
        <SupportTable submissions={submissions} onRefresh={fetchData} />
      ) : null}
    </div>
  );
}
