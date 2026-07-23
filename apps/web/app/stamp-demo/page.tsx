"use client";

/**
 * Demo route for the check-in outcome states and the stamp reveal wiring.
 * Renders ActiveEventSection in each state with a mock event; "stamp
 * earned" opens the real GachaRevealModal, exactly the path the events
 * page takes when the API reports stampAwarded. Lets reviewers see every
 * state without a live event or login. Remove (or gate) once shipped.
 */
import { useState } from "react";
import dynamic from "next/dynamic";
import type { Event } from "@uwdsc/common/types";
import type { CheckInState } from "@/app/events/page";
import { ActiveEventSection } from "@/components/events/ActiveEventSection";

const GachaRevealModal = dynamic(
  () => import("@/components/gacha").then((m) => m.GachaRevealModal),
  { ssr: false },
);

const STATES: { label: string; state: CheckInState; checkingIn?: boolean }[] = [
  { label: "idle", state: "idle" },
  { label: "checking in", state: "idle", checkingIn: true },
  { label: "no stamp", state: "noStamp" },
  { label: "failed", state: "error" },
  { label: "checked in", state: "success" },
];

const mockEvent = {
  id: "demo",
  name: "DSC Demo Night",
  description: "Preview event for the check-in states.",
  location: "MC Comfy",
  start_time: new Date().toISOString(),
  end_time: new Date(Date.now() + 2 * 3600_000).toISOString(),
} as unknown as Event;

export default function StampDemo() {
  const [idx, setIdx] = useState(0);
  const [revealOpen, setRevealOpen] = useState(false);
  const current = STATES[idx]!;

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center gap-8 py-16 px-4">
      <h1 className="text-xl font-black tracking-widest">
        CHECK-IN STATES PREVIEW
      </h1>
      <div className="flex flex-wrap gap-2 justify-center">
        {STATES.map((s, i) => (
          <button
            key={s.label}
            onClick={() => setIdx(i)}
            className={`px-4 py-2 rounded-lg border text-sm font-bold tracking-wide ${
              idx === i
                ? "bg-white text-black border-white"
                : "bg-transparent text-white/70 border-white/30"
            }`}
          >
            {s.label}
          </button>
        ))}
        <button
          onClick={() => setRevealOpen(true)}
          className="px-4 py-2 rounded-lg border text-sm font-bold tracking-wide bg-emerald-500 text-black border-emerald-500"
        >
          stamp earned → reveal
        </button>
      </div>
      <div className="w-full max-w-md rounded-2xl border border-white/15 p-6 bg-white/5">
        <ActiveEventSection
          event={mockEvent}
          canCheckIn
          checkInState={current.state}
          checkInError={current.state === "error" ? "Network request failed" : null}
          checkingIn={current.checkingIn ?? false}
          onCheckIn={() => setRevealOpen(true)}
        />
      </div>
      <p className="text-white/40 text-xs max-w-md text-center">
        The green button (or checking in via the card) plays the real gacha
        reveal, the same modal the events page opens when a check-in earns a
        stamp. Demo route: no login or live event required.
      </p>

      <GachaRevealModal open={revealOpen} onClose={() => setRevealOpen(false)} />
    </main>
  );
}
