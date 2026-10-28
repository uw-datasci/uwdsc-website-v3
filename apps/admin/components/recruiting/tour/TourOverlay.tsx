"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button, cn } from "@uwdsc/ui";
import type { TourStep } from "./tours";

interface TourOverlayProps {
  readonly steps: readonly TourStep[];
  readonly index: number;
  readonly onBack: () => void;
  readonly onNext: () => void;
  readonly onClose: () => void;
}

interface Box {
  top: number;
  left: number;
  width: number;
  height: number;
}

const FIND_TIMEOUT_MS = 4000;
const CARD_WIDTH = 340;
const GAP = 12;
const PAD = 6;

function findTarget(target: string): HTMLElement | null {
  return document.querySelector<HTMLElement>(`[data-tour="${target}"]`);
}

/** Watches the step's `[data-tour]` element and reports its box (null if it never shows up). */
function useTargetBox(target: string): Box | null {
  const [box, setBox] = useState<Box | null>(null);

  useEffect(() => {
    let element: HTMLElement | null = null;
    let frame = 0;
    const started = performance.now();

    const measure = () => {
      if (!element) return;
      const rect = element.getBoundingClientRect();
      setBox({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
    };

    const look = () => {
      element = findTarget(target);
      if (element) {
        element.scrollIntoView({ block: "center", behavior: "smooth" });
        measure();
        return;
      }
      if (performance.now() - started < FIND_TIMEOUT_MS) frame = requestAnimationFrame(look);
      else setBox(null);
    };
    frame = requestAnimationFrame(look);

    const onChange = () => requestAnimationFrame(measure);
    window.addEventListener("scroll", onChange, true);
    window.addEventListener("resize", onChange);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onChange, true);
      window.removeEventListener("resize", onChange);
      setBox(null);
    };
  }, [target]);

  return box;
}

function cardPosition(box: Box | null): CSSProperties {
  if (!box) return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
  const left = Math.min(Math.max(box.left, 16), window.innerWidth - CARD_WIDTH - 16);
  const below = box.top + box.height < window.innerHeight * 0.6;
  return below
    ? { top: box.top + box.height + PAD + GAP, left }
    : { bottom: window.innerHeight - box.top + PAD + GAP, left };
}

/** Spotlight over the step's target plus the step card. */
export function TourOverlay({ steps, index, onBack, onNext, onClose }: TourOverlayProps) {
  const step = steps[index];
  const box = useTargetBox(step?.target ?? "");
  const titleId = useId();
  const nextRef = useRef<HTMLButtonElement>(null);
  const last = index === steps.length - 1;

  useEffect(() => {
    nextRef.current?.focus();
  }, [index]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!step || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      {box ? (
        <div
          aria-hidden
          className="pointer-events-none fixed rounded-lg ring-2 ring-primary transition-all duration-200"
          style={{
            top: box.top - PAD,
            left: box.left - PAD,
            width: box.width + PAD * 2,
            height: box.height + PAD * 2,
            boxShadow: "0 0 0 9999px rgb(0 0 0 / 0.55)",
          }}
        />
      ) : (
        <div aria-hidden className="fixed inset-0 bg-black/55" />
      )}

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="fixed flex flex-col gap-2 rounded-xl border bg-popover p-4 text-popover-foreground shadow-xl"
        style={{ width: CARD_WIDTH, maxWidth: "calc(100vw - 32px)", ...cardPosition(box) }}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Recruiting tour · Step {index + 1} of {steps.length}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="-mr-1.5 size-7"
            aria-label="Close tour"
            onClick={onClose}
          >
            <X className="size-4" aria-hidden />
          </Button>
        </div>
        <h3 id={titleId} className="text-[15px] font-semibold">
          {step.title}
        </h3>
        <p className="text-[13px] leading-relaxed text-muted-foreground">{step.body}</p>
        <div className="mt-2 flex items-center gap-2">
          <div aria-hidden className="flex gap-1">
            {steps.map((item, i) => (
              <span
                key={item.id}
                className={cn(
                  "size-1.5 rounded-full",
                  i === index ? "bg-primary" : "bg-border"
                )}
              />
            ))}
          </div>
          {!last && (
            <Button variant="ghost" size="sm" className="ml-auto" onClick={onClose}>
              Skip tour
            </Button>
          )}
          {index > 0 && (
            <Button
              variant="outline"
              size="sm"
              className={cn(last && "ml-auto")}
              onClick={onBack}
            >
              Back
            </Button>
          )}
          <Button
            ref={nextRef}
            size="sm"
            className={cn(last && index === 0 && "ml-auto")}
            onClick={onNext}
          >
            {last ? "Done" : "Next"}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
