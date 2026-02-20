"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import QRCode from "qrcode";
import { useAuth } from "@/contexts/AuthContext";
import {
  getActiveEvents,
  getAttendanceStatus,
  getMembershipStatus,
} from "@/lib/api";
import {
  buildCheckInQRData,
  getTimeNextStep as getNextStep,
} from "@/lib/utils/checkin";
import type { Event } from "@uwdsc/common/types";
import {
  LoadingState,
  NoMembershipState,
  NoEventState,
  CheckedInState,
  ActiveEventState,
} from "@/components/events";

type PageState =
  | "loading"
  | "no-event"
  | "no-membership"
  | "active"
  | "checked-in";

export default function EventsPage() {
  const { user } = useAuth();

  const [pageState, setPageState] = useState<PageState>("loading");
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [nextEvent, setNextEvent] = useState<Event | null>(null);
  const [membershipId, setMembershipId] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [countdown, setCountdown] = useState(30);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const generateQR = useCallback(async (data: string) => {
    try {
      const url = await QRCode.toDataURL(data, {
        width: 280,
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
        errorCorrectionLevel: "M",
      });
      setQrDataUrl(url);
    } catch (err) {
      console.error("QR generation failed:", err);
    }
  }, []);

  const refreshQR = useCallback(async () => {
    if (!activeEvent || !membershipId || !user) return;
    console.log("HERE", user)

    const data = await buildCheckInQRData({
      eventId: activeEvent.id,
      membershipId,
      userId: user.id,
    });
    await generateQR(data);
    setCountdown(getNextStep());
  }, [activeEvent, membershipId, user, generateQR]);

  const loadData = useCallback(async () => {
    if (!user) return;

    try {
      const [eventsData, membershipData] = await Promise.all([
        getActiveEvents(),
        getMembershipStatus(),
      ]);

      if (!membershipData.has_membership) {
        setNextEvent(eventsData.nextEvent);
        setPageState("no-membership");
        return;
      }

      setMembershipId(membershipData.membership_id);

      if (eventsData.activeEvents.length === 0) {
        setNextEvent(eventsData.nextEvent);
        setPageState("no-event");
        return;
      }

      const event = eventsData.activeEvents[0]!;
      setActiveEvent(event);

      const attendance = await getAttendanceStatus(event.id);
      if (attendance.checked_in) {
        setPageState("checked-in");
        return;
      }

      setPageState("active");
    } catch (err) {
      console.error("Failed to load events data:", err);
      setPageState("no-event");
    }
  }, [user]);

  // Initial data fetch
  useEffect(() => {
    if (user) loadData();
  }, [user, loadData]);

  // QR refresh interval (every 30 seconds) & countdown
  useEffect(() => {
    if (pageState !== "active") return;

    refreshQR();

    intervalRef.current = setInterval(() => refreshQR(), 30_000);

    countdownRef.current = setInterval(() => setCountdown(getNextStep()), 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [pageState, refreshQR]);

  // Poll for attendance changes every 5 seconds
  useEffect(() => {
    if (pageState !== "active" || !activeEvent) return;

    const pollAttendance = setInterval(async () => {
      try {
        const attendance = await getAttendanceStatus(activeEvent.id);
        if (attendance.checked_in) setPageState("checked-in");
      } catch {
        // Silently ignore polling errors
      }
    }, 10000);

    return () => clearInterval(pollAttendance);
  }, [pageState, activeEvent]);

  switch (pageState) {
    case "loading":
      return <LoadingState />;
    case "no-membership":
      return <NoMembershipState nextEvent={nextEvent} />;
    case "no-event":
      return <NoEventState nextEvent={nextEvent} />;
    case "checked-in":
      return <CheckedInState activeEvent={activeEvent} />;
    case "active":
      return (
        <ActiveEventState
          activeEvent={activeEvent!}
          user={user!}
          qrDataUrl={qrDataUrl}
          countdown={countdown}
        />
      );
  }
}
