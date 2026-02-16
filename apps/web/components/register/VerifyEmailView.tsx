"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";
import { Button } from "@uwdsc/ui";
import { resendVerificationEmail } from "@/lib/api";

interface VerifyEmailViewProps {
  readonly email: string;
  readonly loginHref?: string;
}

export function VerifyEmailView({ email, loginHref = "/login" }: VerifyEmailViewProps) {
  const [resendStatus, setResendStatus] = useState("");
  const [isResending, setIsResending] = useState(false);

  const handleResend = async () => {
    if (!email) {
      setResendStatus("Email not found.");
      return;
    }
    setIsResending(true);
    setResendStatus("");
    try {
      await resendVerificationEmail({ email });
      setResendStatus("Verification email resent successfully.");
    } catch (error: unknown) {
      setResendStatus(
        error instanceof Error
          ? error.message
          : "Failed to resend verification email.",
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center text-center text-white">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full animate-pulse" />
        <Mail
          className="w-24 h-24 text-purple-500 animate-bounce"
          strokeWidth={1.5}
        />
      </div>
      <h1 className="gradient-text bg-linear-to-b from-white to-[#ffffff20] text-7xl md:text-8xl font-medium pb-2">
        Verify Email
      </h1>
      <p className="text-xl mt-8 text-gray-300 max-w-2xl">
        We&apos;ve sent a verification link to your email address.
        <br />
        Please check your inbox and click the link to verify your account.
      </p>
      <div className="mt-12 flex flex-col gap-4 items-center">
        <div className="flex flex-row gap-5">
          <Button
            asChild
            size="lg"
            className="group bg-gradient-purple hover:opacity-90 transition-all text-lg font-bold rounded-lg px-8 py-6 flex items-center gap-2"
          >
            <Link href={loginHref}>
              Go to Login
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <div className="flex flex-col items-center">
            <Button
              onClick={handleResend}
              variant="outline"
              size="lg"
              disabled={isResending}
              className="border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white transition-all text-lg font-medium rounded-lg px-8 py-6"
            >
              {isResending ? "Sending..." : "Resend Email"}
            </Button>
          </div>
        </div>
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
    </div>
  );
}
