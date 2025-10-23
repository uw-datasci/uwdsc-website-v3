"use client";

import { useEffect, useState } from "react";
import { MembershipStatsCards } from "@/components/admin/MembershipStatsCards";
import { MembershipsTable } from "@/components/admin/MembershipsTable";
import { getAllProfiles, getMembershipStats } from "@/lib/api";
import type { MemberProfile, MembershipStats } from "@/types/api";

export default function AdminMembershipsPage() {
  const [profiles, setProfiles] = useState<MemberProfile[]>([]);
  const [stats, setStats] = useState<MembershipStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch profiles and stats in parallel
        const [profilesData, statsData] = await Promise.all([
          getAllProfiles(),
          getMembershipStats(),
        ]);

        setProfiles(profilesData);
        setStats(statsData);
      } catch (err) {
        console.error("Error fetching membership data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load membership data"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Membership</h1>
        <p className="text-muted-foreground">Loading membership data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Membership</h1>
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-sm text-destructive">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Membership</h1>
        <p className="text-muted-foreground">
          Manage and view all member profiles and statistics
        </p>
      </div>

      {stats && <MembershipStatsCards stats={stats} />}

      <MembershipsTable profiles={profiles} />
    </div>
  );
}
