"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, MoveLeft, MoveRight, User } from "lucide-react";
import { Button, Card, CardHeader, CardTitle, CardContent } from "@uwdsc/ui";
import { zodResolver } from "@hookform/resolvers/zod";

import { getAllExecPositions } from "@/lib/api/onboarding";
import { getCurrentUser } from "@/lib/api/auth";
import {
  Intro,
  ExecProfile,
  General,
  Submitted,
} from "@/components/onboarding/steps";
import { OnboardingFormValues, OnboardingDefaultValues, onboardingSchema } from "@/lib/schemas/onboarding";
import { useForm } from "react-hook-form";
import { ExecPosition, Term } from "@uwdsc/common/types";

const STEP_FIELDS: Record<number, (keyof OnboardingFormValues)[]> = {
  1: ["fullname", "gmail", "term_type", "in_waterloo", "role", "consent_website"],
  2: ["discord", "consent_instagram", "datasci_competency"],
};

const STEP_NAMES = [
  "Exec Onboarding", 
  "Exec Profile",
  "Socials & Background",
] as const;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -1000 : 1000,
    opacity: 0,
  }),
};

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  //const [currentTerm, setCurrentTerm] = useState<Term | null>(null);
  const [positions, setPositions] = useState<ExecPosition[]>([]);

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: OnboardingDefaultValues,
    mode: "onTouched",
  });

  const prefillFromUser = useCallback(
    (user: { first_name?: string | null; last_name?: string | null; email?: string | null } | null) => {
      if (!user) return;

      const firstName = user.first_name?.trim() ?? "";
      const lastName = user.last_name?.trim() ?? "";
      const fullName = `${firstName} ${lastName}`.trim();
      const email = user.email?.trim() ?? "";

      if (!form.getValues("fullname") && fullName) {
        form.setValue("fullname", fullName, { shouldDirty: false });
      }

      // Keep personal email requirement: don't autofill Waterloo email into gmail field.
      if (
        !form.getValues("gmail") &&
        email &&
        !email.toLowerCase().endsWith("@uwaterloo.ca")
      ) {
        form.setValue("gmail", email, { shouldDirty: false });
      }
    },
    [form],
  );

   useEffect(() => {
    async function fetchInitialData() {
      setIsFetching(true);
      try {
        const [positionsData, currentUser] = await Promise.all([
          getAllExecPositions(),
          getCurrentUser(),
        ]);

        setPositions(positionsData);
        prefillFromUser(currentUser);
        setCurrentStep(1);
      } catch (err) {
        console.error("Failed to fetch application data:", err);
        setFetchError(err instanceof Error ? err.message : "Failed to load application");
      } finally {
        setIsFetching(false);
      }
    }
    fetchInitialData();
  }, [prefillFromUser]);


  const handleStartOnboarding = useCallback(() => {
    setIsLoading(true);
    try {
      setDirection(1);
      setCurrentStep(1);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const goToStep = useCallback(
    (step: number) => {
      setDirection(step > currentStep ? 1 : -1);
      setCurrentStep(step);
    },
    [currentStep],
  );

  const handleNext = useCallback(async () => {
    const fieldsToValidate = STEP_FIELDS[currentStep];
    if (fieldsToValidate) {
      const valid = await form.trigger(fieldsToValidate);
      if (!valid) return;
    }

    setIsLoading(true);
    try {
      // TODO: Add API call to save form data
      if (currentStep === 2) {
        // Submission logic
        goToStep(3);
      } else {
        goToStep(currentStep + 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [currentStep, goToStep, form]);

  const handlePrevious = () => {
    goToStep(currentStep - 1);
  };

  
  const renderButton = () => {
    const isLastStep = currentStep === 2;

    let buttonClassName = "hover:scale-105 ";
    if (isLastStep) {
      buttonClassName += "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:opacity-90 ";
    } else {
      buttonClassName +=
        "bg-secondary-foreground text-slate-800 hover:bg-secondary-foreground/80";
    }

    return (
      <Button
        size="lg"
        onClick={handleNext}
        disabled={isLoading}
        className={buttonClassName}
      >
        {isLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            {isLastStep ? "Submitting..." : "Saving..."}
          </>
        ) : (
          <>
            {isLastStep ? "Submit" : "Next"}
            <MoveRight className="size-4" />
          </>
        )}
      </Button>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Intro
            onStartOnboarding={handleStartOnboarding}
            isLoading={isLoading}
          />
        );
      case 1:
        return (
          <ExecProfile form={form} execPositions={positions} />
        );
      case 2:
        return (
          <General form={form} />
        );
      default:
        return null;
    }
  };

  if (isFetching) {
    return (
      <div className="container mx-auto flex min-h-[50vh] items-center justify-center px-4">
        <Loader2 className="size-8 animate-spin text-blue-400" />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
        <p className="text-lg text-red-400">
          {fetchError ?? "No active application period"}
        </p>
      </div>
    );
  }

  if (currentStep === 3) {
    return (
        <Submitted name={form.getValues("fullname")} />
    );
  }

  return (
   <div className="mt-8 px-4 h-[calc(100vh-130px)] ">
      {/* Header */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold mb-1">W26 Onboarding Form</h1>
        </div>
      </div>

        {/* Application Cards */}
        <Card className={`mx-auto min-h-[calc(100vh-300px)] max-w-4xl shadow-md backdrop-blur-md border border-white/10 ${currentStep === 0 ? "bg-gradient-to-r from-[rgba(80,0,120,0.85)] to-[rgba(8,88,150,0.85)]" : ""}`} >
        <CardHeader className={`${currentStep === 0 ? "" : "bg-gradient-to-r from-[rgba(80,0,120,0.85)] to-[rgba(59,130,246,0.75)]"} rounded-t-xl -mt-6 py-4}`}>

        {/* Step Title with Icon */}
          { currentStep > 0 && STEP_NAMES[currentStep] && (
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2 pt-2 text-2xl">
                  <div className="mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--grey4)]">
                    <User className="h-5 w-5" fill="currentColor" />
                  </div>
                  {STEP_NAMES[currentStep]}
                </CardTitle>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent>
          <div className="space-y-6 overflow-visible">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
            
             {currentStep !== 0 && currentStep !== 3 && (
              <div className="flex justify-between pt-4">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled= {currentStep === -1}
                  className="hover:scale-105"
                >
                  <MoveLeft className="size-4" />
                  Previous
                </Button>

                {renderButton()}
              </div>
            )}
          </div>
        </CardContent>
        </Card>
    </div>
  );
}
