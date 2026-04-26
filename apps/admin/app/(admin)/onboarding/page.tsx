"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { Button, Card, CardContent, CardDescription } from "@uwdsc/ui";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  getAllExecPositions,
  getActiveTerm,
  submitOnboardingForm,
} from "@/lib/api/onboarding";
import { getCurrentUser } from "@/lib/api/auth";
import { ExecProfile, General, Submitted } from "@/components/onboarding/steps";
import {
  OnboardingFormValues,
  OnboardingDefaultValues,
  onboardingSchema,
} from "@/lib/schemas/onboarding";
import { useForm } from "react-hook-form";
import { ExecPosition, Term } from "@uwdsc/common/types";

export default function OnboardingPage() {
  const [currentTerm, setCurrentTerm] = useState<Term | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedName, setSubmittedName] = useState<string | null>(null);
  const [headshotFile, setHeadshotFile] = useState<File | null>(null);
  const [positions, setPositions] = useState<ExecPosition[]>([]);

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: OnboardingDefaultValues,
    mode: "onTouched",
  });

  const prefillFromUser = useCallback(
    (
      user: {
        first_name?: string | null;
        last_name?: string | null;
        email?: string | null;
      } | null,
    ) => {
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
        !form.getValues("email") &&
        email &&
        !email.toLowerCase().endsWith("@uwaterloo.ca")
      ) {
        form.setValue("email", email, { shouldDirty: false });
      }
    },
    [form],
  );

  useEffect(() => {
    async function fetchInitialData() {
      setIsFetching(true);
      try {
        const [positionsData, currentUser, term] = await Promise.all([
          getAllExecPositions(),
          getCurrentUser(),
          getActiveTerm(),
        ]);

        setCurrentTerm(term);
        setPositions(positionsData);
        prefillFromUser(currentUser);
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
  }, [prefillFromUser]);

  const onSubmit = useCallback(
    async (values: OnboardingFormValues) => {
      if (!currentTerm) {
        setSubmitError("No active term found");
        return;
      }

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        await submitOnboardingForm(
          {
            ...values,
            term_id: currentTerm.id,
            instagram: values.instagram ?? null,
            headshot_url: values.headshot_url ?? null,
            anything_else: values.anything_else ?? null,
          },
          headshotFile,
          values.fullname,
        );
        setSubmittedName(values.fullname);
      } catch (err) {
        console.error(err);
        setSubmitError(
          err instanceof Error ? err.message : "Failed to save onboarding",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [currentTerm, headshotFile],
  );

  if (isFetching) {
    return (
      <div className="container mx-auto flex min-h-[50vh] items-center justify-center px-4">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
        <p className="text-lg text-destructive">
          {fetchError ?? "No active application period"}
        </p>
      </div>
    );
  }

  if (submittedName) {
    return <Submitted name={submittedName} />;
  }

  return (
    <div className="min-h-[calc(100vh-130px)] bg-background px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Onboarding
          </p>
          <h1 className="text-3xl font-bold tracking-tight">
            W26 Onboarding Form
          </h1>
          <CardDescription>
            Complete the form below and save once at the bottom. Your headshot
            will be uploaded once you have <b>submitted</b> and <b>paid</b>!
          </CardDescription>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ExecProfile
            form={form}
            execPositions={positions}
            headshotFile={headshotFile}
            onHeadshotFileChange={setHeadshotFile}
          />

          <General form={form} />

          <Card className="border-border bg-card shadow-sm">
            <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">Ready to save your onboarding?</p>
              </div>

              <div className="flex flex-col items-start gap-3 sm:items-end">
                {submitError && (
                  <p className="text-sm text-destructive">{submitError}</p>
                )}

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="size-4" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
