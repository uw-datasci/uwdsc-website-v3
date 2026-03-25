"use client";

import { CheckCircle } from "lucide-react";

interface SubmittedProps {
  readonly name?: string;
}

export function Submitted({ name }: SubmittedProps) {
  return (
    <div className="space-y-6 py-12 text-center">
      <div className="flex justify-center mb-4">
        <CheckCircle className="size-16 text-green-400" />
      </div>
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Welcome to the Team! 🎉</h2>
        {name && <p className="text-lg text-blue-400 font-semibold">{name}</p>}
      </div>
      <p className="text-gray-300 max-w-md mx-auto">
        Your onboarding has been submitted successfully. The admin team will
        review your information and contact you shortly with next steps.
      </p>
      <p className="text-sm text-gray-400 pt-4">
        Thank you for being part of the DSC executive team!
      </p>
    </div>
  );
}
