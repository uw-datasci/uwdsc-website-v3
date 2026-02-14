"use client";

import { useApplicationProgress } from "@/contexts/AppProgressContext";
import {
  applicationDefaultValues,
  applicationSchema,
  type AppFormValues,
} from "@/lib/schemas/application";
import { isStepValid } from "@/lib/utils/application";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { AvailablePositions } from "@/components/application/banners/AvailablePositions";
import { DueDateTag } from "@/components/application/DueDateTag";
import {
  General,
  Intro,
  Personal,
  Positions,
  Resume,
  Submitted,
} from "@/components/application/steps";
import { STEP_NAMES } from "@/constants/application";
import type { Term } from "@uwdsc/common/types";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, MoveLeft, MoveRight, User } from "lucide-react";
import { Button, Card, CardHeader, CardTitle, CardContent } from "@uwdsc/ui";

/** Format term code (e.g. W25) to display name (e.g. Winter 2025) */
function formatTermCode(code: string): string {
  const season = code.charAt(0).toUpperCase();
  const year = "20" + code.slice(1);
  const seasons: Record<string, string> = {
    W: "Winter",
    S: "Spring",
    F: "Fall",
  };
  return `${seasons[season] ?? code} ${year}`;
}

// Animation variants for sliding transitions
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

export default function ApplyPage() {
  const [currentTerm, setCurrentTerm] = useState<Term | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1); // 1 for forward, -1 for backward
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setProgressValue } = useApplicationProgress();

  useEffect(() => {
    setCurrentTerm({
      id: "1",
      code: "W25",
      is_active: true,
      application_release_date: new Date().toISOString(),
      application_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
    });
  }, []);

  const form = useForm<AppFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: applicationDefaultValues,
    mode: "onTouched",
  });

  // Update progress bar based on current step
  useEffect(() => {
    // Step 0 (Intro) shows no progress, other steps show their step number
    setProgressValue(currentStep === 0 ? -1 : currentStep);
  }, [currentStep, setProgressValue]);

  const handleStartApplication = () => {
    // TODO: API call to create application
    setDirection(1);
    setCurrentStep(currentStep + 1);
  };

  const handleNext = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // Example: await updateApplication(form.getValues());
      await new Promise((resolve) => setTimeout(resolve, 1000));

      goToStep(currentStep + 1);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevious = () => {
    goToStep(currentStep - 1);
  };

  const goToStep = (step: number) => {
    setDirection(step > currentStep ? 1 : -1);
    setCurrentStep(step);
  };

  const renderButton = () => {
    const isLastStep = currentStep === 4;
    const isButtonDisabled = !isStepValid(form, currentStep) || isLoading;

    let buttonClassName = "hover:scale-105 ";
    if (isLastStep) {
      buttonClassName += "bg-gradient-orange text-white hover:opacity-90 ";
      buttonClassName += isButtonDisabled ? "disabled" : "animate-glow-pulse";
    } else {
      buttonClassName +=
        "bg-secondary-foreground text-slate-800 hover:bg-secondary-foreground/80";
    }

    return (
      <Button
        size="lg"
        onClick={handleNext}
        disabled={isButtonDisabled}
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
        return <Intro onStartApplication={handleStartApplication} />;
      case 1:
        return <Personal form={form} />;
      case 2:
        return <General form={form} />;
      case 3:
        return <Positions form={form} />;
      case 4:
        return <Resume form={form} />;
    }
  };

  if (!currentTerm) return null;

  if (currentStep === 5) return <Submitted />;

  return (
    <div className="container mx-auto px-4 py-12">
      <DueDateTag deadline={new Date(currentTerm.application_deadline)} />

      <div className="mx-auto max-w-4xl text-center mb-6">
        <h1 className="mb-2 text-3xl font-bold text-white">
          DSC Exec Application Form
        </h1>
        <p className="text-3xl font-semibold text-blue-400">
          {formatTermCode(currentTerm.code)}
        </p>
      </div>

      <AvailablePositions />

      <Card
        className={`mx-auto max-w-4xl shadow-md backdrop-blur-md ${currentStep === 0 ? "bg-gradient-blue" : "bg-slate-900"}`}
      >
        <CardHeader
          className={`${currentStep === 0 ? "" : "bg-gradient-blue"} rounded-t-xl -mt-6 py-4`}
        >
          {STEP_NAMES[currentStep] && (
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <div className="bg-gradient-profile mr-2 flex h-10 w-10 items-center justify-center rounded-full">
                    <User className="h-5 w-5" fill="currentColor" />
                  </div>
                  {STEP_NAMES[currentStep]}
                </CardTitle>
              </div>

              {currentStep !== 0 && currentStep !== 5 && (
                <p className="text-sm text-gray-300 mt-1">
                  Mandatory fields are marked with an asterisk{" "}
                  <span className="text-red-500">*</span>
                </p>
              )}
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

            {currentStep !== 0 && currentStep !== 5 && (
              <div className="flex justify-between pt-4">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
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
