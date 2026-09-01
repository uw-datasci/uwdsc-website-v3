"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ScanOutcome } from "@uwdsc/common/types";
import { Spinner } from "@uwdsc/ui";
import { scanPassportQr } from "@/lib/api/passport";

type SpinState =
  | { status: "idle" }
  | { status: "spinning" }
  | { status: "done"; result: ScanOutcome }
  | { status: "error"; message: string };

/**
 * Runs the scan flow when the page is opened with QR params in the URL.
 * State logic only, the gacha reveal will consume the result later.
 */
export function PassportScanHandler() {
  const search = useSearchParams();
  const router = useRouter();
  const fired = useRef(false);
  const [spin, setSpin] = useState<SpinState>({ status: "idle" });

  const membershipId = search.get("membership_id");
  const eventId = search.get("event_id");
  const token = search.get("token");

  useEffect(() => {
    if (!membershipId || !eventId || !token || fired.current) return;
    fired.current = true; // exactly one spin per page load

    setSpin({ status: "spinning" });
    scanPassportQr({
      membership_id: membershipId,
      event_id: eventId,
      token,
    })
      .then((result) => setSpin({ status: "done", result }))
      .catch((error: Error) =>
        setSpin({ status: "error", message: error.message }),
      )
      .finally(() => router.replace("/passport", { scroll: false }));
  }, [membershipId, eventId, token, router]);

  if (spin.status === "idle") return null;

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center text-sm">
      {spin.status === "spinning" && (
        <div className="flex items-center justify-center gap-2">
          <Spinner className="size-4" />
          <span>Opening mystery box…</span>
        </div>
      )}
      {spin.status === "done" && <ScanResult result={spin.result} />}
      {spin.status === "error" && <span>{spin.message}</span>}
    </div>
  );
}

function ScanResult({ result }: { readonly result: ScanOutcome }) {
  switch (result.outcome) {
    case "won":
      return <span>You unlocked a new stamp!</span>;
    case "lost":
      return (
        <span>No stamp this time - scanning more people boosts your luck.</span>
      );
    case "already_scanned":
      return <span>You already scanned this person at this event.</span>;
    case "already_has_stamp":
      return <span>You already have this event&apos;s stamp.</span>;
  }
}
