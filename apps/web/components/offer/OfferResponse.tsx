"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PublicOfferView } from "@uwdsc/common/types";
import { respondToOffer } from "@/lib/api";
import {
  ConfirmAccept,
  ConfirmDecline,
  OfferAccepted,
  OfferClosed,
  OfferDeclined,
  OfferExpired,
  OfferOpen,
} from "./states";

export type OfferStep = "offer" | "confirmAccept" | "confirmDecline";

interface OfferResponseProps {
  readonly token: string;
  readonly initialView: PublicOfferView;
  readonly initialStep: OfferStep;
  readonly hoursLeft: number;
}

/** Holds the offer, the step and the submit; each state renders from `./states`. */
export function OfferResponse({
  token,
  initialView,
  initialStep,
  hoursLeft,
}: OfferResponseProps) {
  const router = useRouter();
  const [view, setView] = useState(initialView);
  const [step, setStep] = useState<OfferStep>(initialStep);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (response: "accepted" | "declined") => {
    setSubmitting(true);
    setError(null);
    try {
      const next = await respondToOffer(token, {
        response,
        note: response === "declined" && note.trim() ? note.trim() : undefined,
      });
      setView(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
      const status = (err as { status?: number }).status;
      if (status === 409 || status === 410) router.refresh();
    } finally {
      setSubmitting(false);
    }
  };

  const backToOffer = () => setStep("offer");

  switch (view.state) {
    case "accepted":
      return <OfferAccepted view={view} />;
    case "declined":
      return <OfferDeclined view={view} />;
    case "expired":
      return <OfferExpired view={view} />;
    case "closed":
      return <OfferClosed />;
  }

  if (step === "confirmAccept") {
    return (
      <ConfirmAccept
        view={view}
        submitting={submitting}
        error={error}
        onConfirm={() => void submit("accepted")}
        onBack={backToOffer}
      />
    );
  }

  if (step === "confirmDecline") {
    return (
      <ConfirmDecline
        view={view}
        note={note}
        onNoteChange={setNote}
        submitting={submitting}
        error={error}
        onConfirm={() => void submit("declined")}
        onBack={backToOffer}
      />
    );
  }

  return (
    <OfferOpen
      view={view}
      hoursLeft={hoursLeft}
      onAccept={() => setStep("confirmAccept")}
      onDecline={() => setStep("confirmDecline")}
    />
  );
}
