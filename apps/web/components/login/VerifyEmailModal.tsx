"use client";

import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";
import { resendVerificationEmail } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
} from "@uwdsc/ui";

interface VerifyEmailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
}

export function VerifyEmailModal({
  open,
  onOpenChange,
  email,
}: Readonly<VerifyEmailModalProps>) {
  const [resendStatus, setResendStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleResendVerificationEmail = async () => {
    if (!email) {
      setResendStatus("Email not found.");
      return;
    }

    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-linear-to-b from-gray-900 to-black border-gray-800">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/20 blur-2xl rounded-full animate-pulse" />
              <Mail
                className="w-16 h-16 text-purple-500 animate-bounce"
                strokeWidth={1.5}
              />
            </div>
          </div>
          <DialogTitle className="text-2xl text-center text-white">
            Verify Your Email
          </DialogTitle>
          <DialogDescription className="text-center text-gray-300 text-base">
            We&apos;ve sent a verification link to{" "}
            <span className="font-semibold text-purple-400">{email}</span>.
            <br />
            Please check your inbox and click the link to verify your account.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-col gap-3 sm:flex-col">
          <Button
            onClick={handleResendVerificationEmail}
            disabled={isLoading}
            className="w-full bg-gradient-purple hover:opacity-90 transition-all text-white font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Sending...
              </>
            ) : (
              "Resend Verification Email"
            )}
          </Button>

          {resendStatus && (
            <p
              className={`text-sm text-center ${
                resendStatus.includes("successfully")
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {resendStatus}
            </p>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
