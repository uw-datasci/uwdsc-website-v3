"use client";

import {
  STEP_NAMES,
  APPLICATION_RELEASE_DATE,
  APPLICATION_DEADLINE,
} from "@/constants/application";
import { useApplicationProgress } from "@/contexts/AppProgressContext";
import {
  AppFormValues,
  applicationSchema,
  applicationDefaultValues,
} from "@/lib/schemas/application";
import { isStepValid } from "@/lib/utils/application";
import { AppInfo } from "@/types/application";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, Button } from "@uwdsc/ui/index";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { DueDateTag } from "./DueDateTag";
import { Unavailable } from "./Unavailable";
import { DesktopAppWormhole } from "./AppWormhole";
import { StepIndicator } from "./StepIndicator";
import router from "next/router";
import DSCLogo from "../DSCLogo";
import {
  ContactInfo,
  AboutYou,
  OptionalAboutYou,
  Education,
  PriorHackExp,
  LinksAndDocs,
  CxCGain,
  SillyQ,
  Review,
  Submitted,
} from "./sections";

// Animation variants for sliding transitions
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -1000 : 1000,
    opacity: 0,
  }),
};

const FINAL_STEP_COUNT = STEP_NAMES.length;

export default function DesktopApplication() {
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1); // 1 for forward, -1 for backward
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setProgressValue } = useApplicationProgress();

  useEffect(() => {
    // TODO: Fetch questions from database

    setAppInfo({
      appReleaseDate: APPLICATION_RELEASE_DATE,
      appDeadline: APPLICATION_DEADLINE,
      questions: [],
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
    window.scrollTo({ top: 0, behavior: "auto" });
    setProgressValue(currentStep === 0 ? -1 : currentStep);
  }, [currentStep, setProgressValue]);

  const handleNext = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // Example: await updateApplication(form.getValues());
      await new Promise((resolve) => setTimeout(resolve, 1000)); // TO REMOVE
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
    const isLastStep = currentStep === FINAL_STEP_COUNT - 1;
    const isButtonDisabled = !isStepValid(form, currentStep) || isLoading;

    return (
      <Button
        size="lg"
        onClick={handleNext}
        disabled={isButtonDisabled}
        className="rounded-none bg-white text-black !h-auto px-4.5 py-4 font-normal text-xl hover:bg-white/80 hover:scale-105"
      >
        {isLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            {isLastStep ? "Submitting..." : "Saving..."}
          </>
        ) : (
          <>
            {isLastStep ? "Submit" : "Continue"}
            <span className="ml-8 font-sans">→</span>
          </>
        )}
      </Button>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="flex flex-col gap-12">
            <ContactInfo form={form} />
            <AboutYou form={form} />
            <OptionalAboutYou form={form} />
          </div>
        );
      case 1:
        return (
          <div className="flex flex-col gap-12">
            <Education form={form} />
            <PriorHackExp form={form} />
            <LinksAndDocs form={form} />
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col gap-12">
            <CxCGain form={form} />
            <SillyQ form={form} />
          </div>
        );
      case 3:
        return <Review form={form} />;
    }
  };

  //   if (!appInfo) return <Unavailable />;

  if (currentStep === FINAL_STEP_COUNT) return <Submitted />;

  return (
    <div className="hidden md:flex flex-col md:flex-row justify-between min-h-screen h-full cxc-app-font">
      {/* Left Side - Wormhole */}
      <div className="block border-r border-white/50 md:w-2/5 relative">
        <div className="absolute inset-0">
          <DesktopAppWormhole opacity={0.5} />
        </div>

        <div className="absolute inset-0 flex flex-col justify-between py-24 pl-12 pr-12 lg:pr-32 z-10">
          <div>
            <StepIndicator
              currentStep={currentStep + 1}
              totalSteps={FINAL_STEP_COUNT}
              label="CXC 2026"
            />
          </div>
          <DSCLogo
            size={24}
            className="hidden md:block"
            onClick={() => router.push("/")}
          />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="px-12 py-24 overflow-hidden md:w-3/5 flex flex-col gap-12">
        <h1 className="text-5xl font-normal">{STEP_NAMES[currentStep]}</h1>
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

          {currentStep !== FINAL_STEP_COUNT && (
            <div className="flex justify-between pt-4">
              <Button
                size="lg"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="rounded-none bg-black !h-auto !px-4.5 !py-4 text-white hover:scale-105 hover:bg-black/50"
              >
                <ArrowLeftIcon size={24} className="!w-6 !h-6" />
              </Button>

              {renderButton()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
