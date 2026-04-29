"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, Tabs, TabsContent, TabsList, TabsTrigger } from "@uwdsc/ui";
import { toast } from "sonner";
import {
  ApplicationsError,
  ApplicationsLoading,
} from "@/components/applications";
import {
  ApplicantTable,
  FinalizeRolesDialog,
  HiringHeader,
  NewExecTeamPanel,
} from "@/components/applications/hiring";
import {
  getHiringApplicants,
  getNewExecTeam,
  updateSelectionStatus,
} from "@/lib/api";
import {
  buildHiringSubteamOptions,
  filterApplicantsBySubteam,
  HIRING_SUBTEAM_ALL,
} from "@/lib/utils/applications";
import type {
  ApplicationReviewStatus,
  HiringApplicant,
  NewExecTeamMember,
} from "@uwdsc/common/types";

export default function HiringPage() {
  const [applicants, setApplicants] = useState<HiringApplicant[]>([]);
  const [team, setTeam] = useState<NewExecTeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [teamLoading, setTeamLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nameSearch, setNameSearch] = useState("");
  const [subteamFilter, setSubteamFilter] = useState(HIRING_SUBTEAM_ALL);
  const [updatingSelectionId, setUpdatingSelectionId] = useState<string | null>(
    null,
  );

  const fetchApplicants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getHiringApplicants();
      setApplicants(data.applicants);
    } catch (err) {
      console.error("Error fetching hiring applicants:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load applicants",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTeam = useCallback(async () => {
    try {
      setTeamLoading(true);
      const data = await getNewExecTeam();
      setTeam(data.team);
    } catch (err) {
      console.error("Error fetching new exec team:", err);
    } finally {
      setTeamLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplicants();
    fetchTeam();
  }, [fetchApplicants, fetchTeam]);

  const subteamOptions = useMemo(
    () => buildHiringSubteamOptions(applicants),
    [applicants],
  );

  const applicantsMatchingName = useMemo(() => {
    const query = nameSearch.trim().toLowerCase();
    if (!query) return applicants;
    return applicants.filter((app) =>
      app.full_name.toLowerCase().includes(query),
    );
  }, [applicants, nameSearch]);

  const filteredApplicants = useMemo(
    () => filterApplicantsBySubteam(applicantsMatchingName, subteamFilter),
    [applicantsMatchingName, subteamFilter],
  );

  useEffect(() => {
    if (!subteamOptions.some((o) => o.value === subteamFilter)) {
      setSubteamFilter(HIRING_SUBTEAM_ALL);
    }
  }, [subteamOptions, subteamFilter]);

  const handleSelectionStatusChange = async (
    selectionId: string,
    nextStatus: ApplicationReviewStatus,
  ) => {
    setUpdatingSelectionId(selectionId);

    try {
      await updateSelectionStatus(selectionId, nextStatus);
      toast.success("Status updated");
      await fetchApplicants();
      fetchTeam();
    } catch (err) {
      console.error("Error updating selection status:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to update status",
      );
    } finally {
      setUpdatingSelectionId(null);
    }
  };

  const handleFinalized = () => {
    fetchTeam();
  };

  if (loading) return <ApplicationsLoading />;
  if (error) return <ApplicationsError message={error} />;

  return (
    <div className="mt-8 flex h-[calc(100vh-130px)] flex-col">
      <Tabs defaultValue="applicants" className="flex flex-1 flex-col">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="applicants">Applicants</TabsTrigger>
            <TabsTrigger value="team">New Exec Team</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="applicants" className="flex flex-1 flex-col">
          <HiringHeader
            applicantCount={filteredApplicants.length}
            nameSearch={nameSearch}
            onNameSearchChange={setNameSearch}
            subteamFilter={subteamFilter}
            onSubteamFilterChange={setSubteamFilter}
            subteamOptions={subteamOptions}
          />
          <Card className="flex-1 overflow-hidden p-0">
            <ApplicantTable
              applicants={filteredApplicants}
              updatingSelectionId={updatingSelectionId}
              onSelectionStatusChange={handleSelectionStatusChange}
            />
          </Card>
        </TabsContent>

        <TabsContent value="team" className="flex flex-1 flex-col">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="mb-1 text-3xl font-bold">New Exec Team</h1>
              <p className="text-sm text-muted-foreground">
                {team.length} member{team.length === 1 ? "" : "s"} with accepted
                offers
              </p>
            </div>
            <FinalizeRolesDialog
              team={team}
              disabled={teamLoading}
              onFinalized={handleFinalized}
            />
          </div>
          <Card className="flex-1 overflow-hidden p-0">
            <NewExecTeamPanel team={team} loading={teamLoading} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
