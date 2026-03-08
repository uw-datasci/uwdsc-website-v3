"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, MoveLeft, MoveRight, User } from "lucide-react";
import { Button, Card, CardHeader, CardTitle, CardContent } from "@uwdsc/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Intro,
  ExecProfile,
  General,
  Submitted,
} from "@/components/onboarding/steps";
import { OnboardingFormValues, OnboardingDefaultValues, onboardingSchema } from "@/lib/schemas/onboarding";
import { useForm } from "react-hook-form";

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

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: OnboardingDefaultValues,
    mode: "onTouched",
  });

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
    setIsLoading(true);
    try {
      // TODO: Add API call to save form data
      if (currentStep === 4) {
        // Submission logic
        goToStep(4);
      } else {
        goToStep(currentStep + 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [currentStep, goToStep]);

  const handlePrevious = () => {
    goToStep(currentStep - 1);
  };

  
  const renderButton = () => {
    const isLastStep = currentStep === 5;

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
          <ExecProfile form={form} />
        );
      case 2:
        return (
          <General form={form} />
        );
      case 3:
        return (<Submitted name={form.getValues("fullname")} />);
      default:
        return null;
    }
  };

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
