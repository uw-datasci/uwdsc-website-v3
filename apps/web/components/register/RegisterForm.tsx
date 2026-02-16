"use client";

import {
  registerDefaultValues,
  registerSchema,
  type RegisterFormValues,
} from "@/lib/schemas/register";
import { register } from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { renderTextField, Button, Form, FormField } from "@uwdsc/ui";

interface RegisterFormProps {
  readonly onSuccess: (email: string) => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: registerDefaultValues,
    mode: "onTouched",
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setAuthError("");
    setIsLoading(true);
    try {
      await register({
        email: data.email,
        password: data.password,
      });
      onSuccess(data.email);
    } catch (error: unknown) {
      console.error(error);
      setAuthError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again",
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
            name="email"
            render={renderTextField({
              placeholder: "Email (ex. slchow@uwaterloo.ca)",
              className:
                "!h-auto !text-base border-gray-100/80 !bg-black px-4.5 py-3.5 placeholder:text-gray-100/80 rounded-lg xl:px-6 xl:py-4.5",
              inputProps: { type: "email" },
            })}
          />
          <FormField
            control={form.control}
            name="password"
            render={renderTextField({
              placeholder: "Create DSC account password",
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
              placeholder: "Confirm your password",
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
        <div className="flex flex-col gap-1 items-start justify-between mt-6">
          <Button
            size="lg"
            disabled={isLoading}
            type="submit"
            className="w-full rounded-md xl:rounded-lg bg-gradient-purple text-lg font-bold h-auto! py-2.5"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" strokeWidth={3} />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
          <Button
            variant="link"
            size="sm"
            asChild
            className="text-gray-400/60 hover:text-gray-200 transition-colors text-sm font-medium p-0"
          >
            <Link href="/login">Already a member? Sign in here.</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}
