"use client";

import { CheckCircle } from "lucide-react";

interface SubmittedProps {
  readonly name?: string;
}

export function Submitted({ name }: SubmittedProps) {
  return (
    <div className="space-y-6 py-12 text-center">
      <div className="flex justify-center mb-4">
        <CheckCircle className="size-16 text-emerald-500" />
      </div>
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Welcome to the Team! 🎉</h2>
        {name && <p className="text-lg font-semibold text-primary">{name}</p>}
      </div>
      <p className="mx-auto max-w-md text-muted-foreground">
        Your onboarding has been submitted successfully. The admin team will
        review your information and contact you shortly with next steps.
      </p>
      <p className="pt-4 text-sm text-muted-foreground">
        Thank you for being part of the DSC executive team!
      </p>
    </div>
  );
}
