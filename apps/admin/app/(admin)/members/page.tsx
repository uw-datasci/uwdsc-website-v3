"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  MembershipStatsCards,
  MembershipsTable,
} from "@/components/memberships";
import { getAllProfiles, getMembershipStats } from "@/lib/api";
import { Member, MembershipFilter, MembershipStats } from "@uwdsc/common/types";

export default function MembersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [profiles, setProfiles] = useState<Member[]>([]);
  const [stats, setStats] = useState<MembershipStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<MembershipFilter>("all");

  const initialAction = useMemo(() => {
    const id = searchParams.get("id");
    const action = searchParams.get("action");
    if (!id || !action) return null;

    if (action === "edit") {
      return { type: "edit" as const, memberId: id };
    }

    if (action === "markPaid" || action === "payment") {
      return { type: "markPaid" as const, memberId: id };
    }

    return null;
  }, [searchParams]);

  const clearActionFromUrl = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("id");
    params.delete("action");

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  const fetchData = async () => {
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
        err instanceof Error ? err.message : "Failed to load membership data",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 mt-16 w-full">
        <h1 className="text-3xl font-bold">Membership</h1>
        <p className="text-muted-foreground">Loading membership data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 mt-16 w-full">
        <h1 className="text-3xl font-bold">Membership</h1>
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-sm text-destructive">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6w-full">
      <div className="my-8">
        <h1 className="text-3xl font-bold mb-2">Membership</h1>
        <p className="text-muted-foreground">
          Manage and view all member profiles and statistics. Click on the cards
          to quick filter
        </p>
      </div>

      {stats && (
        <MembershipStatsCards
          stats={stats}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      )}

      <MembershipsTable
        profiles={profiles}
        activeFilter={activeFilter}
        onRefresh={fetchData}
        initialAction={initialAction}
        onRequestClearInitialAction={initialAction ? clearActionFromUrl : undefined}
      />
    </div>
  );
}
