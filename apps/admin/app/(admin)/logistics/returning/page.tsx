"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Form } from "@uwdsc/ui";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  ReturningExecFormFields,
  ReturningExecLogisticsHeader,
} from "@/components/logistics/returning";

import { getActiveTerm } from "@/lib/api/onboarding";
import {
  getAvailablePositionsForReturningExec,
  getOwnReturningExecSubmission,
  upsertReturningExecSubmission,
} from "@/lib/api/returningExecs";
import {
  ReturningExecDefaultValues,
  ReturningExecFormValues,
  returningExecSchema,
} from "@/lib/schemas/returningExec";
import { isReturningExecWindowOpen, getDeferredReturnTermCode } from "@uwdsc/common/utils";

function positionIdStringForPriority(
  selections: readonly { priority: number; position_id: number }[],
  priority: 1 | 2 | 3,
): string {
  const row = selections.find((s) => s.priority === priority);
  if (row) return String(row.position_id);

  return "";
}

function interestFormValue(
  interestedInReturning: boolean,
  interestedInFutureTerm: string | null,
): ReturningExecFormValues["interested_in_returning"] {
  if (interestedInReturning) return "true";
  if (interestedInFutureTerm) return "future";
  return "false";
}

export default function LogisticsReturningExecPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [positions, setPositions] = useState<
    Awaited<ReturnType<typeof getAvailablePositionsForReturningExec>>
  >([]);
  const [deferredReturnTermCode, setDeferredReturnTermCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ReturningExecFormValues>({
    resolver: zodResolver(returningExecSchema as never) as Resolver<ReturningExecFormValues>,
    defaultValues: ReturningExecDefaultValues,
    mode: "onChange",
  });

  const interestedInReturning = form.watch("interested_in_returning");
  const followUpDisabled =
    interestedInReturning !== "true" && interestedInReturning !== "future";

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const term = await getActiveTerm();
        if (!isReturningExecWindowOpen(term)) {
          router.replace("/logistics");
          return;
        }

        setDeferredReturnTermCode(getDeferredReturnTermCode(term.code));

        const [positionsData, submissionData] = await Promise.all([
          getAvailablePositionsForReturningExec(),
          getOwnReturningExecSubmission(),
        ]);
        setPositions(positionsData);

        const sub = submissionData.submission;
        if (sub) {
          setSubmitted(true);
          const sel = sub.position_selections ?? [];
          form.reset({
            email: sub.email,
            full_name: sub.full_name,
            discord: sub.discord,
            past_positions: sub.past_positions,
            interested_in_returning: interestFormValue(
              sub.interested_in_returning,
              sub.interested_in_future_term,
            ),
            not_returning_reason: sub.not_returning_reason ?? "",
            first_choice_position: positionIdStringForPriority(sel, 1),
            second_choice_position: positionIdStringForPriority(sel, 2),
            third_choice_position: positionIdStringForPriority(sel, 3),
            in_person_next_term: sub.in_person_next_term ?? undefined,
            qualifications: sub.qualifications,
            additional_notes: sub.additional_notes ?? "",
          });
          await form.trigger();
        } else if (user) {
          form.setValue(
            "full_name",
            [user.first_name, user.last_name].filter(Boolean).join(" "),
            { shouldValidate: true },
          );
          form.setValue("email", user.email ?? "", { shouldValidate: true });
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load form data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user, form, router]);

  async function onSubmit(values: ReturningExecFormValues) {
    setSubmitting(true);
    try {
      const isRet = values.interested_in_returning === "true";
      const isFuture = values.interested_in_returning === "future";
      const needsFollowUp = isRet || isFuture;
      const positionSelections: { position_id: number; priority: 1 | 2 | 3 }[] = [];
      if (needsFollowUp) {
        if (values.first_choice_position)
          positionSelections.push({
            position_id: Number(values.first_choice_position),
            priority: 1,
          });
        if (values.second_choice_position)
          positionSelections.push({
            position_id: Number(values.second_choice_position),
            priority: 2,
          });
        if (values.third_choice_position)
          positionSelections.push({
            position_id: Number(values.third_choice_position),
            priority: 3,
          });
      }

      await upsertReturningExecSubmission({
        term_id: "",
        email: values.email,
        full_name: values.full_name,
        discord: values.discord,
        past_positions: values.past_positions,
        interested_in_returning: isRet,
        interested_in_future_term: isFuture ? deferredReturnTermCode : null,
        not_returning_reason: values.not_returning_reason?.trim()
          ? values.not_returning_reason
          : null,
        in_person_next_term: needsFollowUp ? (values.in_person_next_term ?? null) : null,
        qualifications: needsFollowUp ? (values.qualifications ?? "") : "",
        additional_notes: values.additional_notes ?? null,
        position_selections: positionSelections,
      });

      const wasAlreadySubmitted = submitted;
      setSubmitted(true);
      toast.success(
        wasAlreadySubmitted ? "Response updated successfully" : "Response submitted",
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit response");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const positionOptions = positions.map((p) => ({
    value: String(p.id),
    label: p.name,
  }));

  const submitButtonLoadingText = submitted ? "Updating..." : "Submitting...";
  const submitButtonIdleText = submitted ? "Update Response" : "Submit";

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <ReturningExecLogisticsHeader submitted={submitted} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ReturningExecFormFields
            form={form}
            followUpDisabled={followUpDisabled}
            deferredReturnTermCode={deferredReturnTermCode}
            positionOptions={positionOptions}
            submitted={submitted}
            submitting={submitting}
            submitButtonLoadingText={submitButtonLoadingText}
            submitButtonIdleText={submitButtonIdleText}
          />
        </form>
      </Form>
    </div>
  );
}
