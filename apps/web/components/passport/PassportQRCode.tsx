"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { getEventsByRange, getCheckInStatus } from "@/lib/api/events";

interface PassportQRCodeProps {
  readonly userId: string;
  readonly membershipId: string | null;
  readonly size?: number;
}

// Hardcoded AES key for client-side encryption — prevents screenshot reuse via TOTP expiry
const AES_KEY_HEX = "75776473635f7061737373706f727421";

async function getAesKey(): Promise<CryptoKey> {
  const keyBytes = new Uint8Array(
    AES_KEY_HEX.match(/.{1,2}/g)!.map((b) => parseInt(b, 16)),
  );
  return crypto.subtle.importKey("raw", keyBytes, "AES-CBC", false, ["encrypt"]);
}

async function generateUserSecret(userId: string): Promise<string> {
  const timeWindow = Math.floor(Date.now() / 30000);
  const data = new TextEncoder().encode(`${userId}:${timeWindow}`);
  // IV derived from timestamp window so backend can reconstruct it for verification
  const iv = new Uint8Array(16);
  new DataView(iv.buffer).setFloat64(0, timeWindow);
  const key = await getAesKey();
  const encrypted = await crypto.subtle.encrypt({ name: "AES-CBC", iv }, key, data);
  return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
}

function buildQRValue(
  userSecret: string,
  membershipId: string | null,
  eventId: string | null,
  attendanceId: string | null,
): string {
  const base = "https://uwdatascience.ca/scan";
  const params = new URLSearchParams({ user_secret: userSecret });

  if (eventId && attendanceId) {
    // Event is active — include event_id and attendance_id
    params.set("event_id", eventId);
    params.set("attendance_id", attendanceId);
  } else if (membershipId) {
    // No active event — include membership_id to verify payment
    params.set("membership_id", membershipId);
  }

  return `${base}?${params.toString()}`;
}

export function PassportQRCode({ userId, membershipId, size = 160 }: PassportQRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [eventId, setEventId] = useState<string | null>(null);
  const [attendanceId, setAttendanceId] = useState<string | null>(null);

  // Fetch active event + attendance ID on mount
  useEffect(() => {
    if (!userId) return;
    getEventsByRange("active")
      .then(async (events) => {
        const event = events[0];
        if (!event) return;
        setEventId(event.id);
        const status = await getCheckInStatus(event.id);
        setAttendanceId(status.attendanceId);
      })
      .catch(() => {
        setEventId(null);
        setAttendanceId(null);
      });
  }, [userId]);

  // Draw QR and refresh every 30s in sync with TOTP window
  useEffect(() => {
    if (!canvasRef.current) return;

    const draw = async () => {
      if (!canvasRef.current) return;
      const userSecret = await generateUserSecret(userId);
      const value = buildQRValue(userSecret, membershipId, eventId, attendanceId);
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 1,
        color: {
          dark: "#ffffff",
          light: "#00000000",
        },
      });
    };

    void draw();

    // Sync refresh to 30s window boundary
    const msUntilNextWindow = 30000 - (Date.now() % 30000);
    const timeout = setTimeout(() => {
      void draw();
      const interval = setInterval(() => void draw(), 30000);
      return () => clearInterval(interval);
    }, msUntilNextWindow);

    return () => clearTimeout(timeout);
  }, [userId, membershipId, eventId, attendanceId, size]);

  return <canvas ref={canvasRef} width={size} height={size} />;
}
