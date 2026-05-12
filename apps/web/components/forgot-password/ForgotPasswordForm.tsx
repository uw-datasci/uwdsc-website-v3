"use client";

import {
  ForgotPasswordFormValues,
  forgotPasswordSchema,
  forgotPasswordDefaultValues,
} from "@/lib/schemas/forgotPassword";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { renderTextField, Form, FormField, Button } from "@uwdsc/ui";
import { Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { forgotPassword } from "@/lib/api/auth";

export function ForgotPasswordForm() {
  const [authError, setAuthError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string>("");

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: forgotPasswordDefaultValues,
    mode: "onTouched",
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setAuthError("");
    setIsLoading(true);

    try {
      await forgotPassword(data.email);
      setSubmittedEmail(data.email);
    } catch (error: unknown) {
      setAuthError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (submittedEmail) {
    return (
      <div className="flex flex-col gap-6 items-center text-center">
        <div className="relative">
          <div className="absolute inset-0 bg-purple-500/20 blur-2xl rounded-full animate-pulse" />
          <Mail
            className="w-16 h-16 text-purple-500 animate-bounce"
            strokeWidth={1.5}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-semibold text-white">Check your inbox</h3>
          <p className="text-gray-300 text-base">
            If an account exists for{" "}
            <span className="font-semibold text-purple-400">
              {submittedEmail}
            </span>
            , we&apos;ve sent a password reset link.
          </p>
        </div>
        <Button
          variant="link"
          size="sm"
          asChild
          className="text-gray-400/60 hover:text-gray-200 transition-colors text-sm font-medium p-0"
        >
          <Link href="/login">Back to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={renderTextField({
            placeholder: "Email (ex. slchow@uwaterloo.ca)",
            className:
              "!h-auto !text-base border-gray-100/80 !bg-black px-4.5 py-3.5 placeholder:text-gray-100/80 rounded-lg xl:px-6 xl:py-4.5",
            inputProps: { type: "email" },
          })}
        />

        {authError && (
          <div className="text-red-400 text-base">{authError}</div>
        )}
        <div>
          <Button
            size="lg"
            disabled={isLoading || !form.formState.isValid}
            type="submit"
            className="w-full rounded-md xl:rounded-lg bg-gradient-purple text-lg font-bold h-auto! py-2.5"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" strokeWidth={3} />
                Sending
              </>
            ) : (
              "Send reset link"
            )}
          </Button>
          <div className="flex justify-end items-start mt-1">
            <Button
              variant="link"
              size="sm"
              asChild
              className="text-gray-400/60 hover:text-gray-200 transition-colors text-sm font-medium p-0"
            >
              <Link href="/login">Back to sign in</Link>
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
