"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Lock, Pencil, Save } from "lucide-react";
import { Button, Card, CardContent, CardDescription } from "@uwdsc/ui";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  getAllExecPositions,
  getActiveTerm,
  getOnboardingSubmission,
  submitOnboardingForm,
} from "@/lib/api/onboarding";
import { ExecUser, getCurrentUser } from "@/lib/api/auth";
import { ExecProfile, General } from "@/components/onboarding";
import {
  OnboardingFormValues,
  OnboardingDefaultValues,
  onboardingSchema,
} from "@/lib/schemas/onboarding";
import { useForm } from "react-hook-form";
import { ExecPosition, Onboarding, Term } from "@uwdsc/common/types";

export default function OnboardingPage() {
  const [currentTerm, setCurrentTerm] = useState<Term | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hasSubmission, setHasSubmission] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [headshotFile, setHeadshotFile] = useState<File | null>(null);
  const [positions, setPositions] = useState<ExecPosition[]>([]);
  const [currentUserFullName, setCurrentUserFullName] = useState("");

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
        current_role_id?: number | null;
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

      if ((form.getValues("role_id") ?? 0) === 0 && user.current_role_id) {
        form.setValue("role_id", user.current_role_id, { shouldDirty: false });
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

  const mapSubmissionToForm = useCallback(
    (
      submission: Onboarding,
      user: {
        first_name?: string | null;
        last_name?: string | null;
      } | null,
    ): OnboardingFormValues => {
      const firstName = user?.first_name?.trim() ?? "";
      const lastName = user?.last_name?.trim() ?? "";
      const fallbackName = `${firstName} ${lastName}`.trim();

      return {
        fullname: fallbackName,
        email: submission.email,
        role_id: submission.role_id,
        in_waterloo: submission.in_waterloo,
        term_type: submission.term_type,
        instagram: submission.instagram ?? "",
        headshot_url: submission.headshot_url ?? "",
        consent_website: submission.consent_website,
        consent_instagram: submission.consent_instagram,
        discord: submission.discord,
        datasci_competency: submission.datasci_competency,
        anything_else: submission.anything_else ?? "",
      };
    },
    [],
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

        const typedCurrentUser = currentUser as ExecUser | null;

        setCurrentTerm(term);
        setPositions(positionsData);
        if (typedCurrentUser) {
          const firstName = typedCurrentUser.first_name?.trim() ?? "";
          const lastName = typedCurrentUser.last_name?.trim() ?? "";
          setCurrentUserFullName(`${firstName} ${lastName}`.trim());
        }

        const existingSubmission = await getOnboardingSubmission(term.id);

        if (existingSubmission) {
          form.reset(
            mapSubmissionToForm(existingSubmission, typedCurrentUser),
            {
              keepDirty: false,
            },
          );
          setHasSubmission(true);
          setIsEditing(false);
        } else {
          prefillFromUser(typedCurrentUser);
          setHasSubmission(false);
          setIsEditing(true);
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
  }, [form, mapSubmissionToForm, prefillFromUser]);

  const onSubmit = useCallback(
    async (values: OnboardingFormValues) => {
      if (!currentTerm) {
        setSubmitError("No active term found");
        return;
      }

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const fullName = currentUserFullName;
        await submitOnboardingForm(
          {
            ...values,
            term_id: currentTerm.id,
            instagram: values.instagram ?? null,
            headshot_url: values.headshot_url ?? null,
            anything_else: values.anything_else ?? null,
          },
          headshotFile,
          fullName,
        );
        setHasSubmission(true);
        setIsEditing(false);
        setHeadshotFile(null);
      } catch (err) {
        console.error(err);
        setSubmitError(
          err instanceof Error ? err.message : "Failed to save onboarding",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [currentTerm, headshotFile, currentUserFullName],
  );

  const isFormLocked = hasSubmission && !isEditing;

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

  return (
    <div className="min-h-[calc(100vh-130px)] bg-background px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Onboarding
          </p>
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            W26 Onboarding Form
            {isFormLocked && (
              <Lock
                className="size-6 text-muted-foreground"
                aria-label="Form is locked"
              />
            )}
            {!isFormLocked && hasSubmission && isEditing && (
              <span className="text-lg sm:text-xl font-medium text-primary">
                (editing)
              </span>
            )}
          </h1>
          <CardDescription>
            Complete the form below and save at the bottom. Your headshot will
            be uploaded only when you have <b>saved</b>!
          </CardDescription>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <fieldset
            key={isFormLocked ? "locked" : "editing"}
            disabled={isFormLocked}
            className="space-y-6 disabled:opacity-90"
          >
            <ExecProfile
              key={
                isFormLocked ? "exec-profile-locked" : "exec-profile-editing"
              }
              form={form}
              execPositions={positions}
              headshotFile={headshotFile}
              onHeadshotFileChange={setHeadshotFile}
              isLocked={isFormLocked}
            />

            <General form={form} />
          </fieldset>

          <Card className="border-border bg-card shadow-sm">
            <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">
                  {isFormLocked
                    ? "Your onboarding has been saved"
                    : "Ready to save your onboarding?"}
                </p>
                {!isFormLocked && hasSubmission && (
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    You are in{" "}
                    <span className="font-semibold text-primary">
                      editing mode
                    </span>
                    . Remember to click Save to update your info.
                  </p>
                )}
              </div>

              <div className="flex flex-col items-start gap-3 sm:items-end">
                {submitError && (
                  <p className="text-sm text-destructive">{submitError}</p>
                )}

                {isFormLocked ? (
                  <Button
                    type="button"
                    size="lg"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      setIsEditing(true);
                    }}
                    className="gap-2 border border-primary text-primary bg-background dark:bg-card hover:bg-primary/20 dark:hover:bg-primary/20"
                  >
                    <Pencil className="size-4" />
                    Edit
                  </Button>
                ) : (
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
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
