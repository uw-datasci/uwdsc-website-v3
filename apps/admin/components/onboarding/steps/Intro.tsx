"use client";

import { Button, CardDescription } from "@uwdsc/ui";

interface IntroProps {
  readonly onStartOnboarding: () => void | Promise<void>;
  readonly isLoading?: boolean;
}

export function Intro({ onStartOnboarding, isLoading }: IntroProps) {
  return (
    <div className="space-y-6 py-8 text-center">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">
          Welcome to the Executive Onboarding
        </h2>
        <CardDescription className="text-base leading-relaxed text-muted-foreground">
          New execs: We&apos;re so excited to have you! We&apos;re sure
          you&apos;ll have a great time and make a huge impact to the club!
          Returning execs: We&apos;re so glad to have you back! We&apos;re
          really proud of everything you&apos;ve accomplished and look forward
          to what you bring to the team this term
        </CardDescription>
      </div>

      <div className="flex justify-center pt-12">
        <Button
          onClick={onStartOnboarding}
          disabled={isLoading}
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 transform scale-105"
        >
          Start Onboarding →
        </Button>
      </div>
    </div>
  );
}
