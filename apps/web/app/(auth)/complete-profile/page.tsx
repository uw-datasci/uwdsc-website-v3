"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import {
  completeProfileSchema,
  completeProfileDefaultValues,
  CompleteProfileFormValues,
} from "@/lib/schemas/complete-profile";
import {
  renderTextField,
  renderSelectField,
  Button,
  Form,
  FormField,
} from "@uwdsc/ui";
import { Typing } from "@/components/login/Typing";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getProfile, completeProfile } from "@/lib/api/profile";
import type { Profile } from "@uwdsc/common/types";
import {
  FACULTY_OPTIONS,
  TERM_OPTIONS,
  facultyLabelToValue,
  facultyValueToLabel,
} from "@/constants/profile";

export default function CompleteProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const router = useRouter();
  const { user, isLoading: isAuthLoading, mutate } = useAuth();

  const form = useForm<CompleteProfileFormValues>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: completeProfileDefaultValues,
    mode: "onTouched",
  });

  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    getProfile()
      .then((profile: Profile) => {
        if (cancelled) return;
        if (profile.first_name) form.setValue("first_name", profile.first_name);
        if (profile.last_name) form.setValue("last_name", profile.last_name);
        if (profile.wat_iam) form.setValue("wat_iam", profile.wat_iam);
        if (profile.faculty) {
          const label = facultyValueToLabel[profile.faculty];
          if (label) form.setValue("faculty", label);
        }
        if (profile.term) form.setValue("term", profile.term);
      })
      .catch((err) => {
        if (!cancelled)
          console.error("Failed to load profile for prefill:", err);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- prefill once when user is available
  }, [user]);

  useEffect(() => {
    if (!isAuthLoading && !user) router.push("/login");
  }, [isAuthLoading, user, router]);

  const onSubmit = async (formData: CompleteProfileFormValues) => {
    setAuthError("");
    setIsLoading(true);
    try {
      const profileData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        wat_iam: formData.wat_iam,
        faculty: facultyLabelToValue[formData.faculty] ?? "other_non_waterloo",
        term: formData.term,
        heard_from_where: formData.heard_from_where,
      };

      await completeProfile(profileData);
      await mutate();
      router.push("/");
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

  if (isAuthLoading || !user) {
    return (
      <div className="bg-black w-full min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-black w-full min-h-screen flex flex-col items-center justify-center px-12 py-8">
      <div className="w-full mb-8">
        <Typing
          text="UW Data Science Club"
          speed={75}
          caretSize="text-[42px] font-semibold"
          className="text-3xl font-bold text-white"
        />
      </div>
      <div className="flex-1 flex items-center justify-center w-full">
        <Form {...form}>
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12 w-full h-full max-w-6xl mx-auto">
            {/* Left Information Side */}
            <div className="flex flex-col flex-1 gap-8 justify-center">
              <div className="hidden md:block relative w-40 h-40">
                <Image
                  src="/logos/dsc.svg"
                  alt="uwdsc logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="text-center md:text-start">
                <h2 className="text-7xl font-bold my-10">Almost There!</h2>
                <div className="flex flex-col gap-8 leading-loose text-xl">
                  <p>
                    Your email has been verified! Now let&apos;s complete your
                    profile to finish setting up your account.
                  </p>
                  <p>
                    And after all that hard work ... <br /> Welcome to the club!
                  </p>
                </div>
              </div>
            </div>
            {/* Vertical Divider */}
            <div className="hidden md:block w-px self-stretch bg-gray-500/60" />
            {/* Right Input Side */}
            <div className="w-full h-full flex-1">
              <div className="flex flex-col gap-4">
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
                      "w-full !bg-black !h-auto !px-4.5 !py-3.5 !rounded-lg xl:px-6 xl:py-4.5 border border-gray-100/75 text-base",
                    contentClassName:
                      "bg-black !max-h-64 !overflow-y-auto border-gray-100/75",
                    itemClassName:
                      "text-slate-200 focus:text-white hover:!bg-slate-600/50 hover:text-white rounded-sm px-3 py-3.5 hover:bg-grey4 xl:px-4 xl:py-4 text-base",
                  })}
                />
                <FormField
                  control={form.control}
                  name="term"
                  render={renderSelectField({
                    placeholder: "Current/Last completed term",
                    options: TERM_OPTIONS,
                    triggerClassName:
                      "w-full !bg-black !h-auto !px-4.5 !py-3.5 !rounded-lg xl:px-6 xl:py-4.5 border border-gray-100/75 text-base",
                    contentClassName:
                      "bg-black !max-h-64 !overflow-y-auto border-gray-100/75",
                    itemClassName:
                      "text-slate-200 focus:text-white hover:!bg-slate-600/50 hover:text-white rounded-sm px-3 py-3.5 hover:bg-grey4 xl:px-4 xl:py-4 text-base",
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
              </div>
              {/* Show error */}
              {authError && (
                <div className="text-red-400 text-base mt-3">{authError}</div>
              )}
              <div className="flex flex-col gap-1 items-start justify-between mt-6">
                <Button
                  onClick={form.handleSubmit(onSubmit)}
                  size="lg"
                  disabled={isLoading}
                  type="button"
                  className="w-full rounded-md xl:rounded-lg bg-gradient-purple text-lg font-bold h-auto! py-2.5"
                >
                  {isLoading ? (
                    <>
                      <Loader2
                        className="w-5 h-5 animate-spin"
                        strokeWidth={3}
                      />
                      Completing Profile...
                    </>
                  ) : (
                    "Complete Profile"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
