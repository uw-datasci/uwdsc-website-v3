"use client";

import { useApplicationProgress } from "@/contexts/AppProgressContext";
import {
  createApplication,
  getActiveTerm,
  getApplication,
  getPositionsWithQuestions,
  getProfileAutofill,
  updateApplication,
} from "@/lib/api/application";
import {
  applicationDefaultValues,
  applicationSchema,
  type AppFormValues,
} from "@/lib/schemas/application";
import { isStepValid } from "@/lib/utils/application";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
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
import type { PositionWithQuestions, Term } from "@uwdsc/common/types";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, MoveLeft, MoveRight, User } from "lucide-react";
import { Button, Card, CardHeader, CardTitle, CardContent } from "@uwdsc/ui";

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
  const [positions, setPositions] = useState<PositionWithQuestions[]>([]);
  const [generalQuestionIds, setGeneralQuestionIds] = useState<string[]>([]);
  const [generalQuestions, setGeneralQuestions] = useState<
    { id: string; question_text: string; sort_order: number; placeholder: string | null }[]
  >([]);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { setProgressValue } = useApplicationProgress();

  const form = useForm<AppFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: applicationDefaultValues,
    mode: "onTouched",
  });

  useEffect(() => {
    async function fetchInitialData() {
      setIsFetching(true);
      try {
        const [term, positionsData, autofill] = await Promise.all([
          getActiveTerm(),
          getPositionsWithQuestions(),
          getProfileAutofill(),
        ]);
        setCurrentTerm(term);
        setPositions(positionsData.positions);
        setGeneralQuestionIds(
          positionsData.generalQuestions.map((q) => q.id),
        );
        setGeneralQuestions(positionsData.generalQuestions);

        form.reset({
          ...applicationDefaultValues,
          full_name:
            autofill.first_name && autofill.last_name
              ? `${autofill.first_name} ${autofill.last_name}`.trim()
              : "",
          waterloo_email: autofill.email ?? "",
          academic_term: autofill.term ?? "",
          personal_email: form.getValues("personal_email") || "",
          program: form.getValues("program") || "",
          location: form.getValues("location") || "",
        });

        const existing = await getApplication(term.id);
        if (existing && existing.status === "draft") {
          setApplicationId(existing.id);
          const genIds = new Set(
            positionsData.generalQuestions.map((q) => q.id),
          );
          const generalAnswers: Record<string, string> = {};
          const pos1Answers: Record<string, string> = {};
          const pos2Answers: Record<string, string> = {};
          const pos3Answers: Record<string, string> = {};

          const pos1 = existing.position_selections.find(
            (s) => s.priority === 1,
          );
          const pos2 = existing.position_selections.find(
            (s) => s.priority === 2,
          );
          const pos3 = existing.position_selections.find(
            (s) => s.priority === 3,
          );

          for (const a of existing.answers) {
            if (genIds.has(a.question_id)) {
              generalAnswers[a.question_id] = a.answer_text;
            } else {
              for (const p of positionsData.positions) {
                if (p.questions.some((pq) => pq.id === a.question_id)) {
                  if (pos1?.position_id === p.id)
                    pos1Answers[a.question_id] = a.answer_text;
                  else if (pos2?.position_id === p.id)
                    pos2Answers[a.question_id] = a.answer_text;
                  else if (pos3?.position_id === p.id)
                    pos3Answers[a.question_id] = a.answer_text;
                  break;
                }
              }
            }
          }

          form.reset({
            full_name: existing.full_name,
            personal_email: existing.personal_email ?? "",
            waterloo_email: autofill.email ?? "",
            program: existing.major ?? "",
            academic_term: existing.year_of_study ?? "",
            location: existing.location ?? "",
            club_experience: existing.club_experience ?? undefined,
            general_answers: generalAnswers,
            position_1: pos1?.position_id ?? "",
            position_1_answers: pos1Answers,
            position_2: pos2?.position_id ?? "",
            position_2_answers: pos2Answers,
            position_3: pos3?.position_id ?? "",
            position_3_answers: pos3Answers,
            resumeKey: existing.resume_url ?? "",
          });
          setCurrentStep(1);
        }
      } catch (err) {
        console.error("Failed to fetch application data:", err);
        setFetchError(
          err instanceof Error ? err.message : "Failed to load application",
        );
      } finally {
        setIsFetching(false);
      }
    }
    fetchInitialData();
  }, []);

  useEffect(() => {
    setProgressValue(currentStep === 0 ? -1 : currentStep);
  }, [currentStep, setProgressValue]);

  const handleStartApplication = useCallback(async () => {
    if (!currentTerm) return;
    setIsLoading(true);
    try {
      const app = await createApplication(currentTerm.id);
      setApplicationId(app.id);
      setDirection(1);
      setCurrentStep(1);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [currentTerm]);

  const buildUpdatePayload = useCallback(
    (step: number): Parameters<typeof updateApplication>[1] => {
      const values = form.getValues();
      switch (step) {
        case 1:
          return {
            full_name: values.full_name,
            major: values.program,
            year_of_study: values.academic_term,
            personal_email: values.personal_email,
            location: values.location,
            club_experience: values.club_experience,
          };
        case 2: {
          const generalAnswers = values.general_answers || {};
          const allAnswers: { question_id: string; answer_text: string }[] =
            Object.entries(generalAnswers)
              .filter(([, t]) => t)
              .map(([question_id, answer_text]) => ({
                question_id,
                answer_text,
              }));
          for (const [qid, text] of Object.entries(
            values.position_1_answers || {},
          )) {
            if (text) allAnswers.push({ question_id: qid, answer_text: text });
          }
          for (const [qid, text] of Object.entries(
            values.position_2_answers || {},
          )) {
            if (text) allAnswers.push({ question_id: qid, answer_text: text });
          }
          for (const [qid, text] of Object.entries(
            values.position_3_answers || {},
          )) {
            if (text) allAnswers.push({ question_id: qid, answer_text: text });
          }
          return { answers: allAnswers };
        }
        case 3: {
          const positionsList: { position_id: string; priority: number }[] = [];
          if (values.position_1)
            positionsList.push({ position_id: values.position_1, priority: 1 });
          if (values.position_2)
            positionsList.push({ position_id: values.position_2, priority: 2 });
          if (values.position_3)
            positionsList.push({ position_id: values.position_3, priority: 3 });

          const allAnswers: { question_id: string; answer_text: string }[] = [];
          const generalAnswers = values.general_answers || {};
          for (const [qid, text] of Object.entries(generalAnswers)) {
            if (text) allAnswers.push({ question_id: qid, answer_text: text });
          }
          for (const [qid, text] of Object.entries(
            values.position_1_answers || {},
          )) {
            if (text) allAnswers.push({ question_id: qid, answer_text: text });
          }
          for (const [qid, text] of Object.entries(
            values.position_2_answers || {},
          )) {
            if (text) allAnswers.push({ question_id: qid, answer_text: text });
          }
          for (const [qid, text] of Object.entries(
            values.position_3_answers || {},
          )) {
            if (text) allAnswers.push({ question_id: qid, answer_text: text });
          }

          return {
            position_selections: positionsList,
            answers: allAnswers,
          };
        }
        case 4:
          return { resume_url: values.resumeKey };
        default:
          return {};
      }
    },
    [form],
  );

  const handleNext = useCallback(async () => {
    if (!applicationId) return;
    setIsLoading(true);
    try {
      const payload = buildUpdatePayload(currentStep);
      await updateApplication(applicationId, {
        ...payload,
        ...(currentStep === 4 && { submit: true }),
      });
      goToStep(currentStep === 4 ? 5 : currentStep + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [applicationId, currentStep, buildUpdatePayload]);

  const handlePrevious = () => {
    goToStep(currentStep - 1);
  };

  const goToStep = (step: number) => {
    setDirection(step > currentStep ? 1 : -1);
    setCurrentStep(step);
  };

  const renderButton = () => {
    const isLastStep = currentStep === 4;
    const isValid =
      isStepValid(form, currentStep, {
        positions,
        generalQuestionIds,
      }) || false;
    const isButtonDisabled = !isValid || isLoading;

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
        return (
          <Intro
            onStartApplication={handleStartApplication}
            isLoading={isLoading}
          />
        );
      case 1:
        return <Personal form={form} />;
      case 2:
        return <General form={form} questions={generalQuestions} />;
      case 3:
        return <Positions form={form} positions={positions} />;
      case 4:
        return <Resume form={form} />;
    }
  };

  if (isFetching) {
    return (
      <div className="container mx-auto flex min-h-[50vh] items-center justify-center px-4">
        <Loader2 className="size-8 animate-spin text-blue-400" />
      </div>
    );
  }

  if (fetchError || !currentTerm) {
    return (
      <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
        <p className="text-lg text-red-400">
          {fetchError ?? "No active application period"}
        </p>
      </div>
    );
  }

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
