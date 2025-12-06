"use client";

import { STEP_NAMES } from "@/constants/application";
import { AppFormValues } from "@/lib/schemas/application";
import { isDesktopStepValid } from "@/lib/utils/application";
import {
  slideVariants,
  slideTransition,
} from "@/lib/utils/applicationAnimations";
import { AnimatePresence, motion } from "framer-motion";
import { UseFormReturn } from "react-hook-form";
import { DesktopAppWormhole } from "./AppWormhole";
import { StepIndicator } from "./StepIndicator";
import { AppNavigationButtons } from "./AppNavigationButtons";
import { useApplicationProgressSync } from "@/hooks/useApplicationProgress";
import { useState } from "react";
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
} from "./sections";
import { useEffect } from "react";
import { CONTACT_INFO_FIELDS } from "@/constants/application";
import { getCurrentUser } from "@/lib/api/user";

interface DesktopApplicationProps {
  readonly form: UseFormReturn<AppFormValues>;
  readonly isLoading: boolean;
  readonly onSaveAndContinue: (onSuccess: () => void) => Promise<void>;
  readonly currentStep: number;
  readonly onStepChange: (step: number) => void;
}

const FINAL_STEP_COUNT = STEP_NAMES.length;

export default function DesktopApplication({
  form,
  isLoading,
  onSaveAndContinue,
  currentStep,
  onStepChange,
}: DesktopApplicationProps) {
  const [direction, setDirection] = useState<number>(1);
  useApplicationProgressSync(currentStep);

  const goNext = () => {
    setDirection(1);
    onStepChange(currentStep + 1);
  };

  const goPrevious = () => {
    setDirection(-1);
    onStepChange(currentStep - 1);
  };

  const handleNext = async () => {
    await onSaveAndContinue(goNext);
  };

  useEffect(() => {
    async function loadUser() {
      try {
        const user = await getCurrentUser();
        if (!user) return;

        if (user.email) {
          form.setValue(CONTACT_INFO_FIELDS.email, user.email);
        }
        if (user.first_name && user.last_name) {
          const fullName = [user.first_name, user.last_name].join(" ");
          form.setValue(CONTACT_INFO_FIELDS.name, fullName);
        }
      } catch (err) {
        console.error("Failed to load user:", err);
      }
    }
    loadUser();
  }, [form]);

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
          <DSCLogo size={24} className="hidden md:block" href="/" />
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
              transition={slideTransition}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {currentStep !== FINAL_STEP_COUNT && (
            <AppNavigationButtons
              isFirstStep={currentStep === 0}
              isLastStep={currentStep === FINAL_STEP_COUNT - 1}
              isNextDisabled={
                !isDesktopStepValid(form, currentStep) || isLoading
              }
              isLoading={isLoading}
              onPrevious={goPrevious}
              onNext={handleNext}
            />
          )}
        </div>
      </div>
    </div>
  );
}
