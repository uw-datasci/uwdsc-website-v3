"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { getEventsByRange } from "@/lib/api/events";

interface PassportQRCodeProps {
  readonly userId: string;
  readonly size?: number;
}

function generateTotp(): string {
  // Changes every 30 seconds — scanning page validates by checking current window
  const window = Math.floor(Date.now() / 30000);
  return window.toString(36);
}

function buildQRValue(userId: string, eventId: string | null, totp: string): string {
  const base = "https://uwdatascience.ca/scan";
  const params = new URLSearchParams({ user_id: userId, totp });
  if (eventId) params.set("event_id", eventId);
  return `${base}?${params.toString()}`;
}

export function PassportQRCode({ userId, size = 160 }: PassportQRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [eventId, setEventId] = useState<string | null>(null);

  // Fetch active event once on mount
  useEffect(() => {
    getEventsByRange("active")
      .then((events) => setEventId(events[0]?.id ?? null))
      .catch(() => setEventId(null));
  }, []);

  // Draw QR and refresh every 30s when totp window changes
  useEffect(() => {
    if (!canvasRef.current) return;

    const draw = () => {
      if (!canvasRef.current) return;
      const totp = generateTotp();
      const value = buildQRValue(userId, eventId, totp);
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 1,
        color: {
          dark: "#ffffff",
          light: "#00000000",
        },
      });
    };

    draw();

    // Recalculate ms until next 30s boundary so refresh is always in sync
    const msUntilNextWindow = 30000 - (Date.now() % 30000);
    const timeout = setTimeout(() => {
      draw();
      const interval = setInterval(draw, 30000);
      return () => clearInterval(interval);
    }, msUntilNextWindow);

    return () => clearTimeout(timeout);
  }, [userId, eventId, size]);

  return <canvas ref={canvasRef} width={size} height={size} />;
}
