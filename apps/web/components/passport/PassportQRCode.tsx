"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { getEventsByRange, getCheckInStatus } from "@/lib/api/events";
import { buildPassportQRValue, getTimeNextStep } from "@/lib/utils/qr";

interface PassportQRCodeProps {
  readonly userId: string;
  readonly membershipId: string | null;
  readonly size?: number;
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

  useEffect(() => {
    if (!canvasRef.current) return;

    const draw = async () => {
      if (!canvasRef.current) return;
      const value = await buildPassportQRValue({ userId, membershipId, eventId });
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
    const timeout = setTimeout(() => {
      void draw();
      const interval = setInterval(() => void draw(), 30000);
      return () => clearInterval(interval);
    }, getTimeNextStep());

    return () => clearTimeout(timeout);
  }, [userId, membershipId, eventId, attendanceId, size]);

  return <canvas ref={canvasRef} width={size} height={size} />;
}
