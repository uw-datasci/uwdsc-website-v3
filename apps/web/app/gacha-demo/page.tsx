"use client";

/**
 * Dev-only demo route for the gacha reveal modal.
 * Delete (or gate) before production — it exists so the component can be
 * exercised inside the real app shell.
 */
import dynamic from "next/dynamic";
import { useState } from "react";

const GachaRevealModal = dynamic(
  () => import("@/components/gacha").then((m) => m.GachaRevealModal),
  { ssr: false },
);

export default function GachaDemoPage() {
  // ?open auto-opens the modal (handy for headless smoke tests).
  const [open, setOpen] = useState(
    () => typeof window !== "undefined" && window.location.search.includes("open"),
  );

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          font: "600 16px/1 system-ui, sans-serif",
          padding: "14px 26px",
          borderRadius: 10,
          border: "1px solid #444",
          background: "#111",
          color: "#f4f4f0",
          cursor: "pointer",
        }}
      >
        Open gacha reveal
      </button>

      <GachaRevealModal
        open={open}
        onClose={() => setOpen(false)}
        onComplete={() => console.log("[gacha-demo] reveal complete")}
      />
    </main>
  );
}
