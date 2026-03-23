"use client";

import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Rocket,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import {
  Form,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
} from "@uwdsc/ui";
import {
  foundryFormSchema,
  foundryFormDefaultValues,
  type FoundryFormValues,
} from "@/lib/schemas/foundry";
import { FOUNDRY_STEPS } from "@/constants/foundry";
import { FOUNDRY_STEP_FIELDS, isFoundryStepValid } from "@/lib/utils/foundry";
import { ProjectDetails, TechStack, Description, Introduction } from "./steps";

type SubmitState = "idle" | "submitting" | "success" | "error";

const launchGlowShadow =
  "0 0 0 1px rgb(52 211 153 / 0.4), 0 4px 24px rgb(16 185 129 / 0.45), 0 0 52px rgb(34 197 94 / 0.3)";

/** Parent variants: hover sweep + glow; `processing` = full green while submitting. */
const launchProjectButtonVariants = {
  rest: {
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] as const },
  },
  hover: {
    boxShadow: launchGlowShadow,
    transition: {
      boxShadow: {
        delay: 0.5,
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  },
  processing: {
    boxShadow: launchGlowShadow,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const },
  },
};

const launchProjectOverlayVariants = {
  rest: {
    x: "-100%",
    transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const },
  },
  hover: {
    x: "0%",
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  },
  processing: {
    x: "0%",
    transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] as const },
  },
};

const foundrySlideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 32 : -32,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -32 : 32,
    opacity: 0,
  }),
};

interface StateCardProps {
  readonly icon: React.ReactNode;
  readonly iconClassName: string;
  readonly cardClassName: string;
  readonly title: string;
  readonly description: React.ReactNode;
  readonly actions: React.ReactNode;
}

function StateCard({
  icon,
  iconClassName,
  cardClassName,
  title,
  description,
  actions,
}: StateCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Card className={`w-full ${cardClassName}`}>
        <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
          <div
            className={`flex size-14 items-center justify-center rounded-full ${iconClassName}`}
          >
            {icon}
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-lg font-semibold">{title}</p>
            <p className="text-sm text-muted-foreground max-w-sm">
              {description}
            </p>
          </div>
          {actions}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function FoundryForm() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const form = useForm<FoundryFormValues>({
    resolver: zodResolver(foundryFormSchema),
    mode: "onChange",
    defaultValues: foundryFormDefaultValues,
  });

  // Ensure the parent form component re-renders when step fields change,
  // so Next button enabled/disabled state stays accurate.
  const watchedProjectName = useWatch({
    control: form.control,
    name: "projectName",
  });
  const watchedTeamAccess = useWatch({
    control: form.control,
    name: "teamAccess",
  });
  const watchedProjectType = useWatch({
    control: form.control,
    name: "projectType",
  });
  const watchedDatabase = useWatch({
    control: form.control,
    name: "database",
  });
  const watchedPostgresProvider = useWatch({
    control: form.control,
    name: "postgresProvider",
  });
  const watchedMongoClient = useWatch({
    control: form.control,
    name: "mongoClient",
  });
  const watchedDescription = useWatch({
    control: form.control,
    name: "description",
  });

  const isCurrentStepValid = useMemo(() => {
    return isFoundryStepValid(
      {
        projectName: watchedProjectName,
        teamAccess: watchedTeamAccess,
        projectType: watchedProjectType,
        database: watchedDatabase,
        postgresProvider: watchedPostgresProvider,
        mongoClient: watchedMongoClient,
        description: watchedDescription,
      },
      step,
    );
  }, [
    watchedProjectName,
    watchedTeamAccess,
    watchedProjectType,
    watchedDatabase,
    watchedPostgresProvider,
    watchedMongoClient,
    watchedDescription,
    step,
  ]);
  const goNext = async () => {
    const fields = FOUNDRY_STEP_FIELDS[step];
    const valid = await form.trigger(fields);
    if (!valid) return;
    setDirection(1);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const onSubmit = async (data: FoundryFormValues) => {
    setSubmitState("submitting");
    try {
      // Mocked submission (replace with a real API call when available).
      await new Promise((res, rej) => {
        setTimeout(() => {
          if (Math.random() > 0.2) res(data);
          else
            rej(
              new Error(
                "GitHub Actions workflow dispatch failed. Check your PAT permissions.",
              ),
            );
        }, 2000);
      });
      setSubmitState("success");
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "An unexpected error occurred.",
      );
      setSubmitState("error");
    }
  };

  const resetForm = () => {
    form.reset();
    setStep(1);
    setDirection(1);
    setSubmitState("idle");
    setErrorMessage("");
  };

  switch (submitState) {
    case "success":
      return (
        <StateCard
          icon={<CheckCircle2 className="size-8 text-green-500" />}
          iconClassName="bg-green-500/15"
          cardClassName="border-green-500/30 bg-green-500/5"
          title="Project Launched!"
          description="Your project is in the onboarding queue. In order to continue, it must be approved by the VP of Development."
          actions={
            <div className="flex gap-2 mt-2">
              <Button asChild>
                <a href="/nexus/optics">
                  <ExternalLink className="size-4" />
                  View in Optics
                </a>
              </Button>
              <Button variant="outline" onClick={resetForm}>
                <Rocket className="size-4" />
                Start Another
              </Button>
            </div>
          }
        />
      );

    case "error":
      return (
        <StateCard
          icon={<AlertTriangle className="size-8 text-destructive" />}
          iconClassName="bg-destructive/15"
          cardClassName="border-destructive/30 bg-destructive/5"
          title="Pipeline Failed"
          description={errorMessage}
          actions={
            <Button variant="destructive" onClick={resetForm}>
              <RotateCcw className="size-4" />
              Retry
            </Button>
          }
        />
      );

    default:
      return (
        <Card className="w-full">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between mb-1">
              <CardTitle className="text-base">New Project</CardTitle>
              <span className="text-xs text-muted-foreground">
                Step {step} of {FOUNDRY_STEPS.length}
              </span>
            </div>
            {/* Step progress bar */}
            <div className="flex gap-2 mt-3">
              {FOUNDRY_STEPS.map((s) => (
                <div
                  key={s.id}
                  className="relative flex-1 h-1 rounded-full overflow-hidden bg-muted"
                >
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary"
                    initial={false}
                    animate={{ scaleX: step >= s.id ? 1 : 0 }}
                    style={{ originX: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                </div>
              ))}
            </div>
            {/* Step labels */}
            <div className="flex mt-2 mb-2">
              {FOUNDRY_STEPS.map((s) => (
                <div key={s.id} className="flex-1">
                  <p
                    className={`text-xs transition-colors ${
                      step === s.id
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    {s.title}
                  </p>
                </div>
              ))}
            </div>
            <Separator className="mt-0" />
          </CardHeader>

          <Form {...form}>
            <div>
              <CardContent className="min-h-[280px] relative overflow-hidden">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={step}
                    custom={direction}
                    variants={foundrySlideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="flex flex-col gap-5"
                  >
                    {step === 1 && <Introduction />}
                    {step === 2 && <ProjectDetails />}
                    {step === 3 && <TechStack />}
                    {step === 4 && <Description />}
                  </motion.div>
                </AnimatePresence>
              </CardContent>

              <CardFooter className="flex justify-between pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={goBack}
                  disabled={step === 1}
                >
                  <ChevronLeft className="size-4" />
                  Back
                </Button>

                {step < FOUNDRY_STEPS.length ? (
                  <Button
                    type="button"
                    onClick={goNext}
                    disabled={!isCurrentStepValid}
                  >
                    Next
                    <ChevronRight className="size-4" />
                  </Button>
                ) : (
                  <Button asChild className="relative gap-2">
                    <motion.button
                      type="button"
                      onClick={form.handleSubmit(onSubmit)}
                      disabled={
                        !isCurrentStepValid || submitState === "submitting"
                      }
                      variants={launchProjectButtonVariants}
                      initial="rest"
                      animate={
                        submitState === "submitting" ? "processing" : "rest"
                      }
                      whileHover={
                        submitState === "submitting" ? undefined : "hover"
                      }
                      whileTap={
                        submitState === "submitting"
                          ? undefined
                          : { scale: 0.98 }
                      }
                    >
                      <span
                        className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
                        aria-hidden
                      >
                        <motion.span
                          variants={launchProjectOverlayVariants}
                          className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-500"
                        />
                      </span>
                      <span className="relative z-10 flex items-center gap-2">
                        {submitState === "submitting" ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            Launching…
                          </>
                        ) : (
                          <>
                            <Rocket className="size-4" />
                            Launch Project
                          </>
                        )}
                      </span>
                    </motion.button>
                  </Button>
                )}
              </CardFooter>
            </div>
          </Form>
        </Card>
      );
  }
}
