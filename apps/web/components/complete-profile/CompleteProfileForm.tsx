"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  completeProfileSchema,
  completeProfileDefaultValues,
  type CompleteProfileFormValues,
} from "@/lib/schemas/complete-profile";
import { completeProfile } from "@/lib/api/profile";
import {
  renderTextField,
  renderSelectField,
  Button,
  Form,
  FormField,
} from "@uwdsc/ui";
import { Loader2 } from "lucide-react";
import {
  FACULTY_OPTIONS,
  TERM_OPTIONS,
  facultyLabelToValue,
  facultyValueToLabel,
} from "@/constants/profile";
import type { Profile } from "@uwdsc/common/types";

interface CompleteProfileFormProps {
  readonly prefill?: Profile | null;
  readonly onSuccess: () => void;
}

export function CompleteProfileForm({
  prefill,
  onSuccess,
}: CompleteProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const form = useForm<CompleteProfileFormValues>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: completeProfileDefaultValues,
    mode: "onTouched",
  });

  useEffect(() => {
    if (!prefill) return;
    if (prefill.first_name) form.setValue("first_name", prefill.first_name);
    if (prefill.last_name) form.setValue("last_name", prefill.last_name);
    if (prefill.wat_iam) form.setValue("wat_iam", prefill.wat_iam);
    if (prefill.faculty) {
      const label = facultyValueToLabel[prefill.faculty];
      if (label) form.setValue("faculty", label);
    }
    if (prefill.term) form.setValue("term", prefill.term);
  }, [prefill, form]);

  const onSubmit = async (formData: CompleteProfileFormValues) => {
    setAuthError("");
    setIsLoading(true);
    try {
      const profileData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        wat_iam: formData.wat_iam,
        faculty: facultyLabelToValue[formData.faculty] ?? "math",
        term: formData.term,
        heard_from_where: formData.heard_from_where,
      };

      await completeProfile(profileData);
      onSuccess();
    } catch (error: unknown) {
      const err = error as { error?: string; message?: string };
      console.error(error);
      setAuthError(
        err?.error ??
          err?.message ??
          "An unexpected error occurred. Please try again",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="first_name"
          render={renderTextField({
            placeholder: "Enter your first name",
            className:
              "!h-auto !text-base border-gray-100/80 !bg-black px-4.5 py-3.5 placeholder:text-gray-100/80 rounded-lg xl:px-6 xl:py-4.5",
          })}
        />
        <FormField
          control={form.control}
          name="last_name"
          render={renderTextField({
            placeholder: "Enter your last name",
            className:
              "!h-auto !text-base border-gray-100/80 !bg-black px-4.5 py-3.5 placeholder:text-gray-100/80 rounded-lg xl:px-6 xl:py-4.5",
          })}
        />
        <FormField
          control={form.control}
          name="wat_iam"
          render={renderTextField({
            placeholder: "WatIAM (ex. slchow)",
            className:
              "!h-auto !text-base border-gray-100/80 !bg-black px-4.5 py-3.5 placeholder:text-gray-100/80 rounded-lg xl:px-6 xl:py-4.5",
          })}
        />
        <FormField
          control={form.control}
          name="faculty"
          render={renderSelectField({
            placeholder: "Faculty",
            options: FACULTY_OPTIONS,
            triggerClassName:
              "w-full !h-auto !text-base border border-gray-100/80 !bg-black dark:!bg-black rounded-lg px-4.5 py-3.5 text-white xl:px-6 xl:py-4.5 hover:!bg-black dark:hover:!bg-black focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring [&_svg]:text-gray-400 [&[data-size=default]]:!h-auto",
            contentClassName:
              "bg-black border border-gray-100/80 rounded-lg shadow-lg max-h-64 min-w-[var(--radix-select-trigger-width)]",
            itemClassName:
              "text-slate-200 focus:text-white focus:bg-slate-600/50 hover:bg-slate-600/50 hover:text-white cursor-pointer py-2 pl-3 pr-8 text-base rounded-sm",
            contentPosition: "popper",
          })}
        />
        <FormField
          control={form.control}
          name="term"
          render={renderSelectField({
            placeholder: "Current/Last completed term",
            options: TERM_OPTIONS,
            triggerClassName:
              "w-full !h-auto !text-base border border-gray-100/80 !bg-black dark:!bg-black rounded-lg px-4.5 py-3.5 text-white xl:px-6 xl:py-4.5 hover:!bg-black dark:hover:!bg-black focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring [&_svg]:text-gray-400 [&[data-size=default]]:!h-auto",
            contentClassName:
              "bg-black border border-gray-100/80 rounded-lg shadow-lg max-h-64 min-w-[var(--radix-select-trigger-width)]",
            itemClassName:
              "text-slate-200 focus:text-white focus:bg-slate-600/50 hover:bg-slate-600/50 hover:text-white cursor-pointer py-2 pl-3 pr-8 text-base rounded-sm",
            contentPosition: "popper",
          })}
        />
        <FormField
          control={form.control}
          name="heard_from_where"
          render={renderTextField({
            placeholder: "Where did you hear about us?",
            className:
              "!h-auto !text-base border-gray-100/80 !bg-black px-4.5 py-3.5 placeholder:text-gray-100/80 rounded-lg xl:px-6 xl:py-4.5",
          })}
        />
        {authError && (
          <div className="text-red-400 text-base mt-3">{authError}</div>
        )}
        <div className="flex flex-col gap-1 items-start justify-between mt-6">
          <Button
            size="lg"
            disabled={isLoading || !form.formState.isValid}
            type="submit"
            className="w-full rounded-md xl:rounded-lg bg-gradient-purple text-lg font-bold h-auto! py-2.5"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" strokeWidth={3} />
                Completing Profile...
              </>
            ) : (
              "Complete Profile"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
