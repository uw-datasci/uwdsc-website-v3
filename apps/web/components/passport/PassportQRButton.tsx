"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, X } from "lucide-react";
import { PassportQRCode } from "./PassportQRCode";

interface PassportQRButtonProps {
  readonly userId: string;
  readonly membershipId: string | null;
  /** Positioning for the collapsed trigger button within its (relative) container. */
  readonly className?: string;
}

const QR_MORPH = { type: "spring", stiffness: 300, damping: 32 } as const;

/** Expanded panel edge length, mirrored in the panel's `size-[min(88vw,480px)]` class. */
const QR_PANEL_MAX = 480;
const QR_PANEL_RADIUS = 36;

/**
 * Transform that makes the centred panel exactly overlay the trigger button, so the
 * panel can grow out of it on open and collapse back into it on close.
 */
function getCollapsedTransform(trigger: HTMLElement) {
  const rect = trigger.getBoundingClientRect();
  const panel = Math.min(window.innerWidth * 0.88, QR_PANEL_MAX);
  const scale = rect.width / panel;

  return {
    x: rect.left + rect.width / 2 - window.innerWidth / 2,
    y: rect.top + rect.height / 2 - window.innerHeight / 2,
    scale,
    // Rendered radius is multiplied by `scale`, so pre-divide to land on a circle.
    borderRadius: panel / 2,
  };
}

type CollapsedTransform = ReturnType<typeof getCollapsedTransform>;

export function PassportQRButton({ userId, membershipId, className }: PassportQRButtonProps) {
  const [expanded, setExpanded] = useState(false);
  const [collapsed, setCollapsed] = useState<CollapsedTransform | null>(null);
  const [triggerHidden, setTriggerHidden] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const open = () => {
    if (!triggerRef.current) return;
    setCollapsed(getCollapsedTransform(triggerRef.current));
    setTriggerHidden(true);
    setExpanded(true);
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={open}
        aria-label="Show QR code"
        className={`flex size-9 items-center justify-center rounded-full border border-zinc-700 bg-black/70 text-zinc-100 transition hover:bg-zinc-900 ${
          triggerHidden ? "pointer-events-none opacity-0" : "opacity-100"
        } ${className ?? ""}`}
      >
        <QrCode className="size-4" />
      </button>

      {mounted &&
        createPortal(
          <>
            <AnimatePresence>
              {expanded && (
                <motion.div
                  key="qr-backdrop"
                  className="fixed inset-0 z-90 bg-black/80 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setExpanded(false)}
                />
              )}
            </AnimatePresence>

            <AnimatePresence onExitComplete={() => setTriggerHidden(false)}>
              {expanded && collapsed && (
                <motion.div
                  key="qr-panel"
                  transition={QR_MORPH}
                  initial={collapsed}
                  animate={{ x: 0, y: 0, scale: 1, borderRadius: QR_PANEL_RADIUS }}
                  exit={collapsed}
                  className="fixed inset-0 z-100 m-auto flex size-[min(88vw,480px)] flex-col items-center justify-center gap-3 border-4 border-zinc-600/70 bg-zinc-950 p-12.5 shadow-[0_0_60px_rgba(0,0,0,0.7)]"
                >
                  <motion.div
                    className="flex w-full flex-col items-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.2, delay: 0.15 } }}
                    exit={{ opacity: 0, transition: { duration: 0.08 } }}
                  >
                    <button
                      type="button"
                      onClick={() => setExpanded(false)}
                      className="absolute right-4 top-4 z-10 inline-flex size-9 items-center justify-center rounded-full border border-zinc-700 bg-black/70 text-zinc-100 transition hover:bg-zinc-900"
                      aria-label="Close QR code"
                    >
                      <X className="size-4" />
                    </button>

                    <div className="aspect-square w-full [&>canvas]:size-full!">
                      <PassportQRCode userId={userId} membershipId={membershipId} size={512} />
                    </div>
                    <p className="text-xs text-zinc-400">Scan me for a change to spin</p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>,
          document.body
        )}
    </>
  );
}
