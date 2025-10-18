"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, Button, FormField } from "@uwdsc/ui";
import { useRouter } from "next/navigation";
import { Loader2, Mail, ArrowRight } from "lucide-react";
import { renderTextField } from "@/components/FormHelpers";
import { motion, AnimatePresence } from "framer-motion";
import { register, resendVerificationEmail } from "@/lib/api";

// Simple schema for email and password only
const registerSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Your password needs to be at least 8 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  // Check if form is valid
  const isFormValid = () => {
    const { errors } = form.formState;
    const email = form.watch("email");
    const password = form.watch("password");
    const confirmPassword = form.watch("confirmPassword");

    return (
      !errors.email &&
      !errors.password &&
      !errors.confirmPassword &&
      !!email &&
      !!password &&
      !!confirmPassword &&
      password === confirmPassword
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsLoading(true);
    try {
      const isValid = await form.trigger();
      if (isValid) {
        const formData = form.getValues();

        await register({
          email: formData.email,
          password: formData.password,
        });

        // Show verify email screen with animation
        setRegisteredEmail(formData.email);
        setIsRegistered(true);
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

  const [resendStatus, setResendStatus] = useState("");
  const [isResending, setIsResending] = useState(false);

  const handleResendVerificationEmail = async () => {
    if (!registeredEmail) {
      setResendStatus("Email not found.");
      return;
    }

    setIsResending(true);
    setResendStatus("");

    try {
      await resendVerificationEmail({ email: registeredEmail });
      setResendStatus("Verification email resent successfully.");
    } catch (error: any) {
      setResendStatus(
        error?.error || error?.message || "Failed to resend verification email."
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="bg-black w-full min-h-screen flex flex-col items-center justify-center px-12 py-8 overflow-hidden">
      
      <div className="flex-1 flex items-center justify-center w-full relative">
        <AnimatePresence mode="wait">
          {isRegistered ? (
            <motion.div
              key="verify-email"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full flex flex-col items-center justify-center text-center text-white absolute"
            >
              {/* Animated Mail Icon */}
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full animate-pulse" />
                <Mail
                  className="w-24 h-24 text-purple-500 animate-bounce"
                  strokeWidth={1.5}
                />
              </div>

              {/* Title */}
              <h1 className="text-7xl md:text-8xl font-medium pb-2">
                Verify Email
              </h1>

              {/* Description */}
              <p className="text-xl mt-8 text-gray-300 max-w-2xl">
                We've sent a verification link to your email address.
                <br />
                Please check your inbox and click the link to verify your
                account.
              </p>

              {/* Action Buttons */}
              <div className="mt-12 flex flex-col gap-4 items-center">
                <div className="flex flex-row gap-5">
                  <Button
                    onClick={() => router.push("/login")}
                    size="lg"
                    className="group hover:opacity-90 transition-all text-lg font-bold rounded-lg px-8 py-6 flex items-center gap-2"
                  >
                    Go to Login
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <div className="flex flex-col items-center">
                    <Button
                      onClick={handleResendVerificationEmail}
                      variant="outline"
                      size="lg"
                      disabled={isResending}
                      className="border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white transition-all text-lg font-medium rounded-lg px-8 py-6"
                    >
                      {isResending ? "Sending..." : "Resend Email"}
                    </Button>
                  </div>
                </div>
                {/* Resend status message */}
                {resendStatus && (
                  <p
                    className={`mt-2 text-sm ${
                      resendStatus.includes("successfully")
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {resendStatus}
                  </p>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="registration-form"
              initial={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full absolute"
            >
              <Form {...form}>
                <form onSubmit={handleSubmit} className="w-full">
                  <div className="flex flex-col md:flex-row gap-8 lg:gap-12 w-full h-full max-w-6xl mx-auto">
                    {/* Left Information Side */}
                    <div className="flex flex-col flex-1 gap-8 justify-center">
                      <div className="text-center md:text-start">
                        <h2 className="text-7xl font-bold mb-10">Join Us!</h2>
                        <p className="leading-loose text-xl">
                          Become a part of a growing community of data science
                          enthusiasts and participate in engaging discussions,
                          hands-on projects, and networking opportunities.
                        </p>
                      </div>
                    </div>
                    {/* Vertical Divider */}
                    <div className="hidden md:block w-px self-stretch bg-gray-500/60" />
                    {/* Right Input Side */}
                    <div className="w-full h-full flex-1">
                      <div className="flex flex-col gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={renderTextField(
                            "Email (ex. slchow@uwaterloo.ca)",
                            { variant: "auth", inputProps: { type: "email" } }
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="password"
                          render={renderTextField(
                            "Create DSC account password",
                            {
                              variant: "auth",
                              inputProps: {
                                type: "password",
                                autoComplete: "new-password",
                              },
                            }
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="confirmPassword"
                          render={renderTextField("Confirm your password", {
                            variant: "auth",
                            inputProps: {
                              type: "password",
                              autoComplete: "new-password",
                            },
                          })}
                        />
                      </div>
                      {/* Show Authentication error */}
                      {authError && (
                        <div className="text-red-400 text-base mt-3">
                          {authError}
                        </div>
                      )}
                      <div className="flex flex-col gap-1 items-start justify-between mt-6">
                        <Button
                          size="lg"
                          disabled={!isFormValid() || isLoading}
                          type="submit"
                          className="w-full rounded-md xl:rounded-lg text-lg font-bold !h-auto py-2.5"
                        >
                          {isLoading ? (
                            <>
                              <Loader2
                                className="w-5 h-5 animate-spin"
                                strokeWidth={3}
                              />
                              Creating Account...
                            </>
                          ) : (
                            "Create Account"
                          )}
                        </Button>
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => {
                            router.push("/login");
                          }}
                          className="text-gray-400/60 hover:text-gray-200 transition-colors text-sm font-medium p-0"
                          type="button"
                        >
                          Already a member? Sign in here.
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </Form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
