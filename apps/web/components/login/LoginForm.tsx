"use client";
import {
  LoginFormValues,
  loginSchema,
  loginDefaultValues,
} from "@/lib/schemas/login";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { renderTextField, Form, FormField, Button } from "@uwdsc/ui";
import { Loader2 } from "lucide-react";
import { VerifyEmailModal } from "./VerifyEmailModal";
import { login } from "@/lib/api/auth";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export function LoginForm() {
  const [authError, setAuthError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const { mutate } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: loginDefaultValues,
  });

  const onSubmit = async (data: LoginFormValues) => {
    setAuthError("");
    setIsLoading(true);

    try {
      const responseData = await login({
        email: data.email,
        password: data.password,
      });

      // Success (200): API returns { success: true, user, session }
      await mutate();
      if (!responseData.user?.email_confirmed_at && responseData.user?.email) {
        setUserEmail(responseData.user.email);
        setShowVerifyModal(true);
      } else {
        globalThis.location.href = "/";
      }
    } catch (error: unknown) {
      const err = error as Error & {
        details?: { needsVerification?: boolean; email?: string };
      };
      // 400 with needsVerification: show verify modal instead of error message
      if (err.details?.needsVerification && err.details?.email) {
        setUserEmail(err.details.email);
        setShowVerifyModal(true);
      } else {
        setAuthError(
          err.message ?? "An unexpected error occurred. Please try again.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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

          <FormField
            control={form.control}
            name="password"
            render={renderTextField({
              placeholder: "Password",
              className:
                "!h-auto !text-base border-gray-100/80 !bg-black px-4.5 py-3.5 placeholder:text-gray-100/80 rounded-lg xl:px-6 xl:py-4.5",
              inputProps: { type: "password", autoComplete: "off" },
            })}
          />

          {/* Show Authentication error */}
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
                  Signing in
                </>
              ) : (
                "Sign in"
              )}
            </Button>
            <div className="flex flex-col md:flex-row justify-between items-start mt-1">
              <Button
                variant="link"
                size="sm"
                onClick={() => { }} // TODO: implement logic for forgot password
                className="text-gray-400/60 hover:text-gray-200 transition-colors text-sm font-medium p-0"
                type="button"
              >
                Forgot password?
              </Button>
              <Button
                variant="link"
                size="sm"
                asChild
                className="text-gray-400/60 hover:text-gray-200 transition-colors text-sm font-medium p-0"
              >
                <Link href="/register">Not a member yet? Join here.</Link>
              </Button>
            </div>
          </div>
        </form>
      </Form>

      <VerifyEmailModal
        open={showVerifyModal}
        onOpenChange={setShowVerifyModal}
        email={userEmail}
      />
    </>
  );
}
