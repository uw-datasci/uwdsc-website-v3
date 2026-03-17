"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
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
  type FoundryFormValues,
} from "@/lib/schemas/foundry";
import { FOUNDRY_STEPS } from "@/constants/foundry";
import { ProjectDetails, TechStack, Description, Introduction } from "./steps";

/** Step field slices used for partial trigger validation */
const STEP_FIELDS: Record<number, (keyof FoundryFormValues)[]> = {
  1: [],
  2: ["projectName", "teamAccess"],
  3: ["projectType", "database"],
  4: ["description"],
};

type SubmitState = "idle" | "submitting" | "success" | "error";

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
      <Card className={cardClassName}>
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
    defaultValues: {
      projectName: "",
      teamAccess: "",
      projectType: "nextjs-node",
      database: "postgresql",
      extras: { redis: false, s3: false },
      description: "",
    },
  });

  const goNext = async () => {
    const fields = STEP_FIELDS[step];
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
      // TODO: replace with real API call
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
          title="Pipeline Launched!"
          description="The onboarding GitHub Actions workflow has been triggered. Your project will be ready in under 2 minutes."
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
        <Card>
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
                  <Button type="button" onClick={goNext}>
                    Next
                    <ChevronRight className="size-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={submitState === "submitting"}
                    className="gap-2"
                  >
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
                  </Button>
                )}
              </CardFooter>
            </div>
          </Form>
        </Card>
      );
  }
}
