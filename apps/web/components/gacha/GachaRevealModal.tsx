"use client";

/**
 * Fullscreen gacha reveal modal.
 *
 * Wraps the imperative three.js engine (engine.ts — a mechanical port of the
 * standalone prototype) in a React lifecycle: mounts the engine when opened,
 * fully disposes it (RAF, listeners, WebGL context) on close/unmount.
 *
 * Deliberately a fullscreen takeover: the sequence leans on screen shake, a
 * whiteout and a full-frame invert flash — boxing it into a small popup guts
 * the effect. Treat it like a lightbox.
 *
 * Consumers should load this lazily so three.js never enters the main bundle:
 *   const GachaRevealModal = dynamic(
 *     () => import("@/components/gacha").then((m) => m.GachaRevealModal),
 *     { ssr: false },
 *   );
 */
import { useEffect, useRef } from "react";
import type { GachaEngine } from "./engine";
import "./gacha.css";

const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Bangers&family=Cabin+Sketch:wght@700&display=swap";

export interface GachaRevealModalProps {
  open: boolean;
  onClose: () => void;
  /** Fires once when the reveal settles (the GET moment). */
  onComplete?: () => void;
  /** Override the asset location (defaults to /gacha/assets in public/). */
  assetBase?: string;
}

export function GachaRevealModal({ open, onClose, onComplete, assetBase }: GachaRevealModalProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GachaEngine | null>(null);

  // Keep the latest callbacks without re-mounting the engine on re-renders.
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!open || !rootRef.current) return;

    // The hand-drawn titles use Bangers/Cabin Sketch; inject the font link once.
    if (!document.querySelector(`link[href="${FONT_HREF}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = FONT_HREF;
      document.head.appendChild(link);
    }

    let cancelled = false;
    let engine: GachaEngine | null = null;
    // Dynamic import keeps three.js out of every bundle until first open.
    import("./engine").then(({ createGachaEngine }) => {
      if (cancelled || !rootRef.current) return;
      engine = createGachaEngine(rootRef.current, {
        assetBase,
        onComplete: () => onCompleteRef.current?.(),
      });
      engineRef.current = engine;
    });

    return () => {
      cancelled = true;
      engine?.destroy();
      engineRef.current = null;
    };
  }, [open, assetBase]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100 }}>
      <div ref={rootRef} className="gacha-root" style={{ position: "fixed", inset: 0 }} />
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        style={{
          position: "fixed",
          top: 14,
          right: 16,
          zIndex: 120,
          font: "16px/1 ui-monospace, Menlo, monospace",
          color: "#f4f4f0",
          background: "rgba(0,0,0,0.45)",
          border: "1px solid rgba(244,244,240,0.35)",
          borderRadius: 6,
          padding: "8px 12px",
          cursor: "pointer",
        }}
      >
        &times;
      </button>
    </div>
  );
}
