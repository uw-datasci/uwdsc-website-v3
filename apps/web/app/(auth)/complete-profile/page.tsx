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
  renderTextAreaField,
} from "@/components/FormHelpers";
import { Typing } from "@/components/login/Typing";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getProfile, updateUserProfile } from "@/lib/api";
import { Button, Form, FormField } from "@uwdsc/ui";

// Map the displayed faculty options to enum values
const facultyMap: Record<string, string> = {
  Math: "math",
  Engineering: "engineering",
  Science: "science",
  Arts: "arts",
  Health: "health",
  Environment: "environment",
  "Other/Non-Waterloo": "other_non_waterloo",
};

const facultyOptions = [
  "Math",
  "Engineering",
  "Science",
  "Arts",
  "Health",
  "Environment",
];

const termOptions = [
  "1A",
  "1B",
  "2A",
  "2B",
  "3A",
  "3B",
  "4A",
  "4B",
  "5A",
  "5B",
];

const facultyReverseMap: Record<string, string> = {
  math: "Math",
  engineering: "Engineering",
  science: "Science",
  arts: "Arts",
  health: "Health",
  environment: "Environment",
  other_non_waterloo: "Other/Non-Waterloo",
};

export default function CompleteProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();
  const { mutate } = useAuth();

  const form = useForm<CompleteProfileFormValues>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: completeProfileDefaultValues,
    mode: "onTouched",
  });

  const prefillForm = (profile: any) => {
    if (profile.first_name) form.setValue("first_name", profile.first_name);
    if (profile.last_name) form.setValue("last_name", profile.last_name);
    if (profile.wat_iam) form.setValue("wat_iam", profile.wat_iam);
    if (profile.faculty) {
      const mappedFaculty = facultyReverseMap[profile.faculty];
      if (mappedFaculty) form.setValue("faculty", mappedFaculty);
    }
    if (profile.term) form.setValue("term", profile.term);
    if (profile.heard_from_where)
      form.setValue("heard_from_where", profile.heard_from_where);
    if (profile.member_ideas)
      form.setValue("member_ideas", profile.member_ideas);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await getProfile();
        setIsAuthenticated(true);
        if (data.profile) prefillForm(data.profile);
      } catch (error: any) {
        console.error("Auth check failed:", error);
        router.push("/login");
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router, form]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsLoading(true);
    try {
      const isValid = await form.trigger();
      if (isValid) {
        const formData = form.getValues();

        // Map faculty to enum value
        const profileData = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          wat_iam: formData.wat_iam,
          faculty: facultyMap[formData.faculty] ?? "other_non_waterloo",
          term: formData.term,
          heard_from_where: formData.heard_from_where,
          member_ideas: formData.member_ideas || "",
        };

        await updateUserProfile(profileData);

        // Refresh the user profile in the auth context
        await mutate();
        // Redirect to home page after successful profile completion
        router.push("/");
      }
    } catch (error: any) {
      console.error(error);
      setAuthError(
        error?.error ||
          error?.message ||
          "An unexpected error occurred. Please try again",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth || !isAuthenticated) {
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
                    options: facultyOptions,
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
                    options: termOptions,
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
                <FormField
                  control={form.control}
                  name="member_ideas"
                  render={renderTextAreaField({
                    placeholder:
                      "[Optional] Share your ideas for new events or improvements!",
                    className:
                      "min-h-24 max-h-40 border-gray-100/80 bg-black px-4.5 py-3.5 placeholder:text-gray-100/80 rounded-lg xl:px-6 xl:py-4.5 !text-base",
                  })}
                />
              </div>
              {/* Show error */}
              {authError && (
                <div className="text-red-400 text-base mt-3">{authError}</div>
              )}
              <div className="flex flex-col gap-1 items-start justify-between mt-6">
                <Button
                  onClick={handleSubmit}
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
