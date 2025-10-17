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
import { Form, Button, FormField } from "@uwdsc/ui";
import {
  renderRegistrationTextField,
  renderRegistrationSelectField,
  renderRegistrationTextAreaField,
} from "@/components/RegistrationFormHelper";
import Typing from "@/components/register/Typing";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

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
  "Other/Non-Waterloo",
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

export default function CompleteProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const form = useForm<CompleteProfileFormValues>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: completeProfileDefaultValues,
    mode: "onTouched",
  });

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setIsAuthenticated(true);
          } else {
            router.push("/login");
          }
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

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
          wat_iam: formData.wat_iam || "",
          faculty: facultyMap[formData.faculty] ?? "other_non_waterloo",
          term: formData.term,
          heard_from_where: formData.heard_from_where,
          member_ideas: formData.member_ideas || "",
        };

        const res = await fetch("/api/user/profile", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profileData),
        });

        const data = await res.json();
        if (res.ok) {
          // Redirect to home page after successful profile completion
          router.push("/");
        } else {
          setAuthError(
            data.error || data.message || "Failed to update profile"
          );
        }
      }
    } catch (error) {
      console.error(error);
      setAuthError("An unexpected error occurred. Please try again");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
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
                />
              </div>
              <div className="text-center md:text-start">
                <h2 className="text-7xl font-bold my-10">Almost There!</h2>
                <div className="flex flex-col gap-8 leading-loose text-xl">
                  <p>
                    Your email has been verified! Now let's complete your
                    profile to finish setting up your account.
                  </p>
                  <p>
                    And after all that hard work ... <br /> Welcome to the club!
                  </p>
                  <p className="text-sm text-gray-400">
                    *If 2+ faculties that include Math, choose Math
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
                  render={renderRegistrationTextField(
                    "Enter your first name",
                    {}
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={renderRegistrationTextField(
                    "Enter your last name",
                    {}
                  )}
                />
                <FormField
                  control={form.control}
                  name="wat_iam"
                  render={renderRegistrationTextField(
                    "[Optional] WatIAM (ex. slchow)",
                    {}
                  )}
                />
                <FormField
                  control={form.control}
                  name="faculty"
                  render={renderRegistrationSelectField(
                    "Faculty",
                    facultyOptions
                  )}
                />
                <FormField
                  control={form.control}
                  name="term"
                  render={renderRegistrationSelectField(
                    "Current/Last completed term",
                    termOptions
                  )}
                />
                <FormField
                  control={form.control}
                  name="heard_from_where"
                  render={renderRegistrationTextField(
                    "Where did you hear about us?"
                  )}
                />
                <FormField
                  control={form.control}
                  name="member_ideas"
                  render={renderRegistrationTextAreaField(
                    "[Optional] Share your ideas for new events or improvements!"
                  )}
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
                  className="w-full rounded-md xl:rounded-lg bg-gradient-purple text-lg font-bold !h-auto py-2.5"
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
