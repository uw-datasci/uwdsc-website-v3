"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, FormField, renderTextField } from "@uwdsc/ui";
import { AlertCircle, Loader2 } from "lucide-react";
import { signIn } from "@/lib/api/auth";
import {
  LoginFormValues,
  loginSchema,
  loginDefaultValues,
} from "@/lib/schemas/login";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<{
    message: string;
    needsVerification?: boolean;
  } | null>(null);

  const redirect = searchParams.get("redirect") || "/members";

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: loginDefaultValues,
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setLoginError(null);

    try {
      await signIn({ email: data.email, password: data.password });
      router.push(redirect);
      router.refresh();
    } catch (err) {
      const raw =
        err instanceof Error ? err.message : "Something went wrong. Try again.";
      const needsVerification = Boolean(
        err &&
          typeof err === "object" &&
          "details" in err &&
          (err as { details?: { needsVerification?: boolean } }).details
            ?.needsVerification,
      );
      const lower = raw.toLowerCase();
      const message =
        lower.includes("invalid login credentials") ||
        lower.includes("invalid credentials")
          ? "Incorrect email or password. Check your details and try again."
          : raw;
      setLoginError({ message, needsVerification });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Admin Login</h1>
          <p className="text-muted-foreground">
            Sign in to access the admin dashboard
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {loginError && (
              <div
                role="alert"
                aria-live="polite"
                className="flex gap-3 rounded-lg border border-destructive/80 bg-destructive/10 p-4 text-sm text-destructive"
              >
                <AlertCircle
                  className="mt-0.5 h-5 w-5 shrink-0"
                  aria-hidden
                />
                <div className="min-w-0 space-y-1">
                  <p className="font-semibold leading-tight">
                    {loginError.needsVerification
                      ? "Email not verified"
                      : "Could not sign you in"}
                  </p>
                  <p className="leading-snug text-destructive/95">
                    {loginError.message}
                  </p>
                  {loginError.needsVerification && (
                    <p className="pt-1 text-xs leading-snug text-destructive/85">
                      Open the verification link we sent to your inbox, then try
                      signing in again.
                    </p>
                  )}
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="email"
              render={renderTextField({
                label: "Email",
                placeholder: "Email",
                required: true,
                inputProps: { type: "email" },
              })}
            />

            <FormField
              control={form.control}
              name="password"
              render={renderTextField({
                label: "Password",
                placeholder: "Password",
                required: true,
                inputProps: { type: "password", autoComplete: "off" },
              })}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
