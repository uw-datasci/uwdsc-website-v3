"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, Camera, CameraOff } from "lucide-react";
import { Button } from "@uwdsc/ui";
import {
  validateAndCheckIn,
  uncheckIn,
  getAllEvents,
  getAllProfiles,
  manualCheckIn,
} from "@/lib/api";
import {
  QrScanner,
  SuccessState,
  FailureState,
  ManualCheckInForm,
} from "@/components/checkin";
import type { Event, Member, Profile } from "@uwdsc/common/types";

type PageState = "idle" | "scanning" | "validating" | "success" | "failure";

export default function CheckInPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [pageState, setPageState] = useState<PageState>("idle");
  const [error, setError] = useState<string>("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [eventId, setEventId] = useState<string>("");
  const [isUnchecking, setIsUnchecking] = useState(false);

  // Manual Check-in State
  const [events, setEvents] = useState<Event[]>([]);
  const [profiles, setProfiles] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<string>("");

  useEffect(() => {
    getAllEvents({ activeOnly: true })
      .then((evts) => {
        setEvents(evts);
        const firstActive = evts[0];
        if (firstActive) setSelectedEventId(firstActive.id);
      })
      .catch(console.error);

    getAllProfiles({ paidOnly: true }).then(setProfiles).catch(console.error);
  }, []);

  const filteredProfiles = useMemo(() => {
    if (!searchQuery) return [];
    const query = searchQuery.toLowerCase();
    return profiles
      .filter(
        (p) =>
          (p.first_name?.toLowerCase() ?? "").includes(query) ||
          (p.last_name?.toLowerCase() ?? "").includes(query) ||
          (p.email?.toLowerCase() ?? "").includes(query) ||
          (p.wat_iam?.toLowerCase() ?? "").includes(query),
      )
      .slice(0, 5);
  }, [searchQuery, profiles]);

  const handleManualCheckIn = async (profileId: string) => {
    if (!selectedEventId) {
      setError("Please select an event before checking in");
      setPageState("failure");
      return;
    }
    setPageState("validating");
    setEventId(selectedEventId);
    try {
      const result = await manualCheckIn({
        event_id: selectedEventId,
        profile_id: profileId,
      });
      setProfile(result.profile);
      setPageState("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Manual Check-in failed");
      setPageState("failure");
    }
  };

  // Auto-validate when query params are present
  const processCheckIn = useCallback(
    async (data: {
      event_id: string;
      membership_id: string;
      token: string;
    }) => {
      setPageState("validating");
      setEventId(data.event_id);

      try {
        const result = await validateAndCheckIn(data);
        setProfile(result.profile);
        setPageState("success");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Check-in failed");
        setPageState("failure");
      }
    },
    [],
  );

  // Check for query params on mount
  useEffect(() => {
    const event_id = searchParams.get("event_id");
    const membership_id = searchParams.get("membership_id");
    const token = searchParams.get("token");

    if (event_id && membership_id && token) {
      processCheckIn({ event_id, membership_id, token });
    }
  }, [searchParams, processCheckIn]);

  // Handle QR scan result
  const handleScan = (data: {
    event_id: string;
    membership_id: string;
    token: string;
  }) => {
    processCheckIn(data);
  };

  // Handle scan error
  const handleScanError = (err: string) => {
    setError(err);
    setPageState("failure");
  };

  // Retry — open scanner
  const handleRetry = () => {
    setError("");
    setProfile(null);
    // Clear query params
    router.replace("/checkin");
    setPageState("scanning");
  };

  // Uncheck-in
  const handleUncheckIn = async () => {
    if (!profile || !eventId) return;
    setIsUnchecking(true);
    try {
      await uncheckIn({ event_id: eventId, profile_id: profile.id });
      setProfile(null);
      setPageState("idle");
      router.replace("/checkin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Uncheck-in failed");
      setPageState("failure");
    } finally {
      setIsUnchecking(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-6 max-w-md w-full mx-auto">
        {pageState === "idle" && (
          <ManualCheckInForm
            events={events}
            profiles={profiles}
            selectedEventId={selectedEventId}
            setSelectedEventId={setSelectedEventId}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredProfiles={filteredProfiles}
            onCheckIn={handleManualCheckIn}
            onOpenScanner={() => setPageState("scanning")}
          />
        )}

        {pageState === "scanning" && (
          <QrScanner onScan={handleScan} onError={handleScanError} />
        )}

        {pageState === "validating" && (
          <div className="flex flex-col items-center text-center py-12">
            <Loader2 className="size-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Validating check-in...</p>
          </div>
        )}

        {pageState === "success" && profile && (
          <SuccessState
            profile={profile}
            onUncheckIn={handleUncheckIn}
            isUnchecking={isUnchecking}
          />
        )}

        {pageState === "failure" && (
          <FailureState error={error} onRetry={handleRetry} />
        )}
      </div>
    </div>
  );
}
