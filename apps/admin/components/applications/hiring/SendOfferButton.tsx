"use client";

import { motion } from "framer-motion";
import { Button } from "@uwdsc/ui";
import { cn } from "@uwdsc/ui/lib/utils";
import { Loader2Icon, Send } from "lucide-react";

export type SendOfferPhase = "idle" | "loading" | "success";

function SendOfferIconMorph({ loading }: { readonly loading: boolean }) {
  return (
    <span
      className="relative inline-flex size-3.5 shrink-0 items-center justify-center"
      aria-hidden
    >
      <Send
        className={cn(
          "absolute size-3.5 transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none",
          loading
            ? "scale-50 rotate-12 opacity-0"
            : "scale-100 rotate-0 opacity-100",
        )}
      />
      <Loader2Icon
        className={cn(
          "absolute size-3.5 transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none",
          loading
            ? "scale-100 rotate-0 opacity-100 animate-spin motion-reduce:animate-none"
            : "scale-50 -rotate-12 opacity-0",
        )}
      />
    </span>
  );
}

function SendOfferSuccessIcon() {
  return (
    <span className="relative inline-flex size-3.5 shrink-0 items-center justify-center text-white">
      <svg viewBox="0 0 24 24" className="size-3.5" fill="none" aria-hidden>
        <motion.path
          d="M5 13l4 4L19 7"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 1 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
    </span>
  );
}

function SendOfferIconSlot({ phase }: { readonly phase: SendOfferPhase }) {
  if (phase === "success") return <SendOfferSuccessIcon />;
  return <SendOfferIconMorph loading={phase === "loading"} />;
}

function sendOfferButtonLabel(phase: SendOfferPhase): string {
  if (phase === "loading") return "Sending...";
  if (phase === "success") return "Sent";
  return "Send offer";
}

interface SendOfferButtonProps {
  readonly phase: SendOfferPhase;
  readonly onSendOffer: () => void;
}

export function SendOfferButton({ phase, onSendOffer }: SendOfferButtonProps) {
  const isBusy = phase === "loading";
  const isDone = phase === "success";

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      className={cn(
        "h-8 min-w-[7.5rem] gap-1.5 transition-colors",
        isDone &&
          "border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-600 dark:border-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-500",
      )}
      disabled={isBusy || isDone}
      onClick={onSendOffer}
      aria-busy={isBusy}
      aria-label={isDone ? "Offer sent" : undefined}
    >
      {sendOfferButtonLabel(phase)}
      <SendOfferIconSlot phase={phase} />
    </Button>
  );
}
