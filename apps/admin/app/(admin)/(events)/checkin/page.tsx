"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, QrCode, Camera, CameraOff } from "lucide-react";
import { Button } from "@uwdsc/ui";
import { validateAndCheckIn, uncheckIn } from "@/lib/api";
import { QrScanner, SuccessState, FailureState } from "@/components/checkin";
import type { Profile } from "@uwdsc/common/types";

type PageState = "idle" | "scanning" | "validating" | "success" | "failure";

export default function CheckInPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [pageState, setPageState] = useState<PageState>("idle");
  const [error, setError] = useState<string>("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [eventId, setEventId] = useState<string>("");
  const [isUnchecking, setIsUnchecking] = useState(false);

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
        setError(
          err instanceof Error ? err.message : "Check-in failed",
        );
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
      setError(
        err instanceof Error ? err.message : "Uncheck-in failed",
      );
      setPageState("failure");
    } finally {
      setIsUnchecking(false);
    }
  };

  switch (pageState) {
    case "idle":
      return (
        <div className="flex flex-col items-center text-center">
          <div className="rounded-2xl border bg-card p-8 max-w-md w-full shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <QrCode className="size-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">Ready to Scan</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Activate the camera to scan a member&apos;s check-in QR code.
              The QR code is displayed on the member&apos;s Events page.
            </p>
            <Button
              onClick={() => setPageState("scanning")}
              className="w-full"
            >
              <Camera className="mr-2 size-4" />
              Open Scanner
            </Button>
          </div>
        </div>
      );
    case "scanning":
      return (
        <div className="flex flex-col items-center gap-4">
          <QrScanner onScan={handleScan} onError={handleScanError} />
          <Button
            variant="outline"
            onClick={() => setPageState("idle")}
          >
            <CameraOff className="mr-2 size-4" />
            Close Scanner
          </Button>
        </div>
      );
    case "validating":
      return (
        <div className="flex flex-col items-center text-center py-12">
          <Loader2 className="size-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Validating check-in...</p>
        </div>
      );
    case "success":
      if (!profile) return null;
      return (
        <SuccessState
          profile={profile}
          onUncheckIn={handleUncheckIn}
          isUnchecking={isUnchecking}
        />
      );
    case "failure":
      return (
        <FailureState error={error} onRetry={handleRetry} />
      );
  }
}
