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
  Form,
  Button,
  FormField,
  Input,
  FormItem,
  FormControl,
  FormMessage,
} from "@uwdsc/ui";
import { renderTextField } from "@/components/FormHelpers";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getAuthMe, updateUserProfile } from "@/lib/api";

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
    if (profile.dob) {
      // Convert datetime to date string (YYYY-MM-DD) without timezone conversion
      const dateStr = profile.dob.split("T")[0];
      if (dateStr) form.setValue("dob", dateStr);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await getAuthMe();
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

        const profileData = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          dob: formData.dob,
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
          "An unexpected error occurred. Please try again"
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
      <div className="flex-1 flex items-center justify-center w-full">
        <Form {...form}>
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12 w-full h-full max-w-6xl mx-auto items-center">
            {/* Left Information Side */}
            <div className="flex flex-col flex-1 gap-8 justify-center">
              <div className="text-center md:text-start">
                <h2 className="text-7xl font-bold my-10">Almost There!</h2>
                <div className="flex flex-col gap-8 leading-loose text-xl">
                  <p>
                    Your email has been verified! Now let's complete your
                    profile to finish setting up your account.
                  </p>
                  <p>
                    And after all that hard work ... <br /> Welcome to CxC!
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
                  render={renderTextField("Enter your first name", {
                    variant: "auth",
                  })}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={renderTextField("Enter your last name", {
                    variant: "auth",
                  })}
                />
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="date"
                          placeholder="Date of Birth"
                          className="!h-auto !text-base border-gray-100/80 !bg-black px-4.5 py-3.5 placeholder:text-gray-100/80 rounded-lg xl:px-6 xl:py-4.5"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
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
                  className="w-full rounded-md xl:rounded-lg text-lg font-bold !h-auto py-2.5"
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
