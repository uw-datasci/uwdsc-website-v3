"use client";

import {
  ResetPasswordFormValues,
  resetPasswordSchema,
  resetPasswordDefaultValues,
} from "@/lib/schemas/resetPassword";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { renderTextField, Form, FormField, Button } from "@uwdsc/ui";
import { Loader2 } from "lucide-react";
import { resetPassword } from "@/lib/api/auth";
import { useAuth } from "@/contexts/AuthContext";

export function ResetPasswordForm() {
  const [authError, setAuthError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useAuth();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: resetPasswordDefaultValues,
    mode: "onTouched",
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setAuthError("");
    setIsLoading(true);

    try {
      await resetPassword(data.password);
      await mutate();
      globalThis.location.href = "/";
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="password"
            render={renderTextField({
              placeholder: "New password",
              className:
                "!h-auto !text-base border-gray-100/80 !bg-black px-4.5 py-3.5 placeholder:text-gray-100/80 rounded-lg xl:px-6 xl:py-4.5",
              inputProps: {
                type: "password",
                autoComplete: "new-password",
              },
            })}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={renderTextField({
              placeholder: "Confirm new password",
              className:
                "!h-auto !text-base border-gray-100/80 !bg-black px-4.5 py-3.5 placeholder:text-gray-100/80 rounded-lg xl:px-6 xl:py-4.5",
              inputProps: {
                type: "password",
                autoComplete: "new-password",
              },
            })}
          />
        </div>
        {authError && (
          <div className="text-red-400 text-base mt-3">{authError}</div>
        )}
        <div className="mt-6">
          <Button
            size="lg"
            disabled={isLoading || !form.formState.isValid}
            type="submit"
            className="w-full rounded-md xl:rounded-lg bg-gradient-purple text-lg font-bold h-auto! py-2.5"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" strokeWidth={3} />
                Updating password
              </>
            ) : (
              "Update password"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
