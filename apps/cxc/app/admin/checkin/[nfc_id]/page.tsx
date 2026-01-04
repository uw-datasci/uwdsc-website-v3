"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, Button } from "@uwdsc/ui";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface CheckInResponse {
  success: boolean;
  message: string;
  profile?: {
    id: string;
    role: string;
  };
  error?: string;
}

export default function AdminCheckInPage() {
  const params = useParams();
  const router = useRouter();
  const nfcId = params.nfc_id as string;

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [events, setEvents] = useState<
    Array<{ id: string; name: string; start_time: string }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkInResult, setCheckInResult] = useState<CheckInResponse | null>(
    null,
  );
  const [profile, setProfile] = useState<{
    role: string;
  } | null>(null);

  // Load events and profile on mount
  useEffect(() => {
    async function loadData() {
      try {
        // Load events
        const eventsRes = await fetch("/api/admin/events");
        if (eventsRes.ok) {
          const data = await eventsRes.json();
          setEvents(data.events || []);
          // Load cached event or set first event as default
          if (data.events && data.events.length > 0) {
            const cachedEventId = localStorage.getItem("admin_selected_event_id");
            if (cachedEventId && data.events.some(e => String(e.id) === cachedEventId)) {
              setSelectedEventId(cachedEventId);
            } else {
              setSelectedEventId(String(data.events[0].id));
            }
          }
        }

        // Load profile by NFC ID
        const profileRes = await fetch(`/api/admin/nfc?nfc_id=${nfcId}`);
        if (profileRes.ok) {
          const data = await profileRes.json();
          setProfile(data.profile);
        } else if (profileRes.status === 404) {
          setCheckInResult({
            success: false,
            message: "Profile not found for this NFC ID",
            error: "Profile not found",
          });
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setCheckInResult({
          success: false,
          message: "Failed to load data",
          error: String(error),
        });
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [nfcId]);

  const handleCheckIn = async () => {
    if (!selectedEventId) {
      setCheckInResult({
        success: false,
        message: "Please select an event",
        error: "No event selected",
      });
      return;
    }

    setCheckingIn(true);
    setCheckInResult(null);

    try {
      const response = await fetch("/api/admin/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nfc_id: nfcId,
          event_id: selectedEventId,
        }),
      });

      const data: CheckInResponse = await response.json();

      if (response.ok && data.success) {
        // Copy NFC ID to clipboard on first check-in
        // This allows admin to write it to the NFC tag
        try {
          await navigator.clipboard.writeText(nfcId);
          // Update message to indicate NFC ID was copied
          setCheckInResult({
            ...data,
            message: `${data.message} NFC ID copied to clipboard!`,
          });
        } catch (clipboardError) {
          console.error("Failed to copy NFC ID to clipboard:", clipboardError);
          setCheckInResult(data);
        }
        
        // Clear result after 5 seconds
        setTimeout(() => {
          setCheckInResult(null);
        }, 5000);
      } else {
        setCheckInResult(data);
      }
    } catch (error) {
      setCheckInResult({
        success: false,
        message: "Failed to check in user",
        error: String(error),
      });
    } finally {
      setCheckingIn(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>NFC Check-In</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* NFC ID Display */}
          <div>
            <label className="text-sm font-medium mb-2 block">NFC ID</label>
            <div className="p-3 bg-muted rounded-md font-mono text-sm">
              {nfcId}
            </div>
          </div>

          {/* Profile Info */}
          {profile && (
            <div>
              <label className="text-sm font-medium mb-2 block">User</label>
              <div className="p-3 bg-muted rounded-md">
                Role: {profile.role}
              </div>
            </div>
          )}

          {/* Event Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Select Event
            </label>
            <select
              value={selectedEventId || ""}
              onChange={(e) => {
                const eventId = e.target.value;
                setSelectedEventId(eventId);
                // Cache selected event in localStorage
                localStorage.setItem("admin_selected_event_id", eventId);
              }}
              className="w-full p-3 border rounded-md bg-background"
              disabled={checkingIn}
            >
              {events.length === 0 ? (
                <option value="">No events available</option>
              ) : (
                events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name} - {new Date(event.start_time).toLocaleDateString()}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Check In Button */}
          <Button
            onClick={handleCheckIn}
            disabled={!selectedEventId || checkingIn || !profile}
            className="w-full"
          >
            {checkingIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking In...
              </>
            ) : (
              "Check In"
            )}
          </Button>

          {/* Result Message */}
          {checkInResult && (
            <div
              className={`p-4 rounded-md flex items-center gap-2 ${
                checkInResult.success
                  ? "bg-green-500/10 text-green-500 border border-green-500/20"
                  : "bg-red-500/10 text-red-500 border border-red-500/20"
              }`}
            >
              {checkInResult.success ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
              <span>{checkInResult.message}</span>
            </div>
          )}

          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => router.push("/admin/events")}
            className="w-full"
          >
            Back to Events
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

