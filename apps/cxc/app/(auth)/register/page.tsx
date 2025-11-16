"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, Button, FormField } from "@uwdsc/ui";
import { useRouter } from "next/navigation";
import { Loader2, Mail } from "lucide-react";
import { renderTextField } from "@/components/FormHelpers";
import { motion, AnimatePresence } from "framer-motion";
import { register, resendVerificationEmail } from "@/lib/api";
import {
  DesktopAppWormhole,
  MobileAppWormhole,
} from "@/components/application/AppWormhole";
import { StepIndicator } from "@/components/application/StepIndicator";
import Image from "next/image";
import DSCLogo from "@/components/DSCLogo";

// Updated schema with first name and last name
const registerSchema = z
  .object({
    firstName: z.string().min(1, "Please enter your first name"),
    lastName: z.string().min(1, "Please enter your last name"),
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
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  // Check if form is valid
  const isFormValid = () => {
    const { errors } = form.formState;
    const firstName = form.watch("firstName");
    const lastName = form.watch("lastName");
    const email = form.watch("email");
    const password = form.watch("password");
    const confirmPassword = form.watch("confirmPassword");

    return (
      !errors.firstName &&
      !errors.lastName &&
      !errors.email &&
      !errors.password &&
      !errors.confirmPassword &&
      !!firstName &&
      !!lastName &&
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
          metadata: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          },
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
    <div className="min-h-screen h-full cxc-app-font">
      {/* Desktop View */}
      <div className="hidden md:flex flex-col md:flex-row justify-between min-h-screen h-full">
        {/* Left Side - Wormhole */}
        <div className="block border-r border-white/50 md:w-2/5 relative">
          <div className="absolute inset-0">
            <DesktopAppWormhole opacity={0.5} />
          </div>

          <div className="absolute inset-0 flex flex-col justify-between py-24 px-12 z-10">
            <div>
              <StepIndicator currentStep={0} totalSteps={6} label="CXC 2026" />
            </div>
            <DSCLogo
              size={24}
              className="hidden md:block"
              onClick={() => router.push("/")}
            />
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="px-12 py-24 overflow-hidden md:w-3/5 flex flex-col gap-12">
          <AnimatePresence mode="wait">
            {isRegistered ? (
              <motion.div
                key="verify-email"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full flex flex-col text-white"
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
                <h1 className="text-6xl lg:text-7xl font-medium mb-8">
                  Verify Email
                </h1>

                {/* Description */}
                <p className="text-base lg:text-lg text-gray-300 mb-12">
                  We've sent a verification link to your email address.
                  <br />
                  Please check your inbox and click the link to verify your
                  account.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-4">
                    <Button
                      onClick={() => router.push("/login")}
                      className="!bg-white !text-black text-lg rounded-none !h-auto px-4 py-2 hover:!scale-105 hover:!bg-white font-normal"
                    >
                      Go to Login
                      <span className="ml-8 font-sans">→</span>
                    </Button>
                    <Button
                      onClick={handleResendVerificationEmail}
                      disabled={isResending}
                      className="!bg-transparent !text-white border border-white/50 text-lg rounded-none !h-auto px-4 py-2 hover:!scale-105 hover:!bg-white/10 font-normal"
                    >
                      {isResending ? "Sending..." : "Resend Email"}
                    </Button>
                  </div>
                  {/* Resend status message */}
                  {resendStatus && (
                    <p
                      className={`text-sm ${
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
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full"
              >
                <h1 className="text-6xl lg:text-7xl mb-12">
                  Create your account
                </h1>

                <Form {...form}>
                  <form onSubmit={handleSubmit} className="w-full">
                    <div className="flex flex flex-col gap-10 mb-10">
                      <div className="flex flex-col gap-4">
                        {/* Details Section */}
                        <h2 className="text-lg">Your details</h2>
                        <div className="flex flex-col lg:flex-row gap-4">
                          {/* First name */}
                          <div className="flex-1">
                            <FormField
                              control={form.control}
                              name="firstName"
                              render={renderTextField("First Name", {
                                variant: "application",
                                inputProps: { type: "text" },
                              })}
                            />
                          </div>
                          {/* Last name */}
                          <div className="flex-1">
                            <FormField
                              control={form.control}
                              name="lastName"
                              render={renderTextField("Last Name", {
                                variant: "application",
                                inputProps: { type: "text" },
                              })}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-4">
                        <h2 className="text-lg">Your account</h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                          {/* Email */}
                          <div className="flex flex-col h-full">
                            <FormField
                              control={form.control}
                              name="email"
                              render={renderTextField("Email", {
                                variant: "application",
                                inputProps: { type: "email" },
                              })}
                            />
                          </div>
                          {/* Password */}
                          <div className="flex flex-col h-full">
                            <FormField
                              control={form.control}
                              name="password"
                              render={renderTextField(
                                "Password (at least 8 characters)",
                                {
                                  variant: "application",
                                  inputProps: {
                                    type: "password",
                                    autoComplete: "new-password",
                                  },
                                }
                              )}
                            />
                          </div>
                          {/* Confirm password */}
                          <div className="lg:col-start-2 flex flex-col h-full">
                            <FormField
                              control={form.control}
                              name="confirmPassword"
                              render={renderTextField("Confirm your password", {
                                variant: "application",
                                inputProps: {
                                  type: "password",
                                  autoComplete: "new-password",
                                },
                              })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {authError && (
                      <div className="text-red-400 text-base mb-4">
                        {authError}
                      </div>
                    )}

                    <div className="flex flex-col gap-4 font-normal">
                      <Button
                        disabled={!isFormValid() || isLoading}
                        type="submit"
                        className="!bg-white !text-black text-lg rounded-none !h-auto px-4 py-2 hover:!scale-105 hover:!bg-white w-fit"
                      >
                        {isLoading ? (
                          <>
                            <Loader2
                              className="w-5 h-5 animate-spin"
                              strokeWidth={3}
                            />
                            Creating...
                          </>
                        ) : (
                          <>
                            Create Account
                            <span className="ml-8 font-sans">→</span>
                          </>
                        )}
                      </Button>
                      <Button
                        variant="link"
                        onClick={() => {
                          router.push("/login");
                        }}
                        className="text-gray-400/60 hover:text-gray-200 transition-colors text-sm font-medium p-0 w-fit"
                        type="button"
                      >
                        Already a member? Sign in here.
                      </Button>
                    </div>
                  </form>
                </Form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden relative min-h-screen">
        <div className="absolute inset-0 -z-10">
          <MobileAppWormhole opacity={0.3} />
        </div>
        <div className="relative min-h-screen z-10 p-8 overflow-hidden flex flex-col gap-12 justify-center">
          <AnimatePresence mode="wait">
            {isRegistered ? (
              <motion.div
                key="verify-email-mobile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full flex flex-col items-center text-center text-white"
              >
                {/* Animated Mail Icon */}
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full animate-pulse" />
                  <Mail
                    className="w-20 h-20 text-purple-500 animate-bounce"
                    strokeWidth={1.5}
                  />
                </div>

                <h1 className="text-5xl font-medium mb-6">Verify Email</h1>
                <p className="text-sm text-gray-300 mb-8">
                  We've sent a verification link to your email address. Please
                  check your inbox and click the link to verify your account.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col gap-4 w-full">
                  <Button
                    onClick={() => router.push("/login")}
                    className="!bg-white !text-black text-base rounded-none !h-auto px-3 py-2 hover:!scale-105 hover:!bg-white font-normal"
                  >
                    Go to Login
                    <span className="ml-4 font-sans">→</span>
                  </Button>
                  <Button
                    onClick={handleResendVerificationEmail}
                    disabled={isResending}
                    className="!bg-transparent !text-white border border-white/50 text-base rounded-none !h-auto px-3 py-2 hover:!scale-105 hover:!bg-white/10 font-normal"
                  >
                    {isResending ? "Sending..." : "Resend Email"}
                  </Button>
                  {resendStatus && (
                    <p
                      className={`text-sm ${
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
                key="registration-form-mobile"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full"
              >
                <div className="text-center mb-8">
                  <h1 className="text-5xl mb-6">Join Us!</h1>
                  <p className="text-sm">
                    Become a part of a growing community of data science
                    enthusiasts.
                  </p>
                </div>

                <Form {...form}>
                  <form onSubmit={handleSubmit} className="w-full">
                    <div className="flex flex-col gap-4 mb-6">
                      {/* First Name and Last Name stacked on mobile */}
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={renderTextField("First Name", {
                          variant: "application",
                          inputProps: { type: "text" },
                        })}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={renderTextField("Last Name", {
                          variant: "application",
                          inputProps: { type: "text" },
                        })}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={renderTextField(
                          "Email (ex. slchow@uwaterloo.ca)",
                          {
                            variant: "application",
                            inputProps: { type: "email" },
                          }
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={renderTextField("Create DSC account password", {
                          variant: "application",
                          inputProps: {
                            type: "password",
                            autoComplete: "new-password",
                          },
                        })}
                      />
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={renderTextField("Confirm your password", {
                          variant: "application",
                          inputProps: {
                            type: "password",
                            autoComplete: "new-password",
                          },
                        })}
                      />
                    </div>

                    {authError && (
                      <div className="text-red-400 text-sm mb-4">
                        {authError}
                      </div>
                    )}

                    <div className="flex flex-col gap-4 font-normal">
                      <Button
                        disabled={!isFormValid() || isLoading}
                        type="submit"
                        className="!bg-white !text-black text-base rounded-none !h-auto px-3 py-2 hover:!scale-105 hover:!bg-white w-full"
                      >
                        {isLoading ? (
                          <>
                            <Loader2
                              className="w-5 h-5 animate-spin"
                              strokeWidth={3}
                            />
                            Creating...
                          </>
                        ) : (
                          <>
                            Create Account
                            <span className="ml-4 font-sans">→</span>
                          </>
                        )}
                      </Button>
                      <Button
                        variant="link"
                        onClick={() => {
                          router.push("/login");
                        }}
                        className="text-gray-400/60 hover:text-gray-200 transition-colors text-sm font-medium p-0"
                        type="button"
                      >
                        Already a member? Sign in here.
                      </Button>
                    </div>
                  </form>
                </Form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
