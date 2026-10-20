"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { verifyEmail } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { WEB_COMPLETE_PROFILE_PATH } from "@uwdsc/common/constants";
import { Button } from "@uwdsc/ui";
import { Loader2 } from "lucide-react";
import { AuthHeader } from "@/components/login/AuthHeader";
import Image from "next/image";

function ConfirmEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { mutate } = useAuth();
  const token_hash = searchParams.get("token_hash");
  const code = searchParams.get("code");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Links sent with the old Supabase template come back through Supabase's verify
  // endpoint with a PKCE ?code= instead of a token_hash; hand those to the callback.
  useEffect(() => {
    if (!token_hash && code) {
      globalThis.location.replace(
        `/api/auth/callback?code=${encodeURIComponent(code)}&next=${WEB_COMPLETE_PROFILE_PATH}`
      );
    }
  }, [token_hash, code]);

  const handleVerify = async () => {
    if (!token_hash) {
      setError("Missing verification token. Please request a new confirmation email.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await verifyEmail(token_hash);
      await mutate();
      router.replace(WEB_COMPLETE_PROFILE_PATH);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred. Please try again."
      );
      setIsLoading(false);
    }
  };

  if (!token_hash && code) return <ConfirmEmailFallback />;

  return (
    <div className="bg-black w-full min-h-dvh flex flex-col items-center justify-center px-4 py-6 sm:px-8 sm:py-8 md:px-12">
      <AuthHeader className="mb-6 sm:mb-8" />
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 w-full h-full max-w-6xl mx-auto">
          <div className="flex flex-col flex-1 gap-8 justify-center">
            <div className="hidden md:block relative w-40 h-40">
              <Image
                src="/logos/dsc.svg"
                alt="uwdsc logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center md:text-start my-4 sm:my-6 md:my-10">
                Confirm your email
              </h2>
              <div className="flex flex-col gap-8 text-base leading-relaxed sm:text-lg md:text-xl md:leading-loose text-center md:text-start">
                <p>
                  Click the button below to verify your email and finish setting up your
                  account.
                </p>
              </div>
            </div>
          </div>
          <div className="hidden md:block w-px self-stretch bg-gray-500/60" />
          <div className="w-full h-full flex-1 my-auto flex flex-col gap-4 justify-center">
            <Button
              size="lg"
              disabled={isLoading || !token_hash}
              onClick={handleVerify}
              className="w-full rounded-md xl:rounded-lg bg-gradient-purple text-lg font-bold h-auto! py-2.5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" strokeWidth={3} />
                  Verifying
                </>
              ) : (
                "Confirm email"
              )}
            </Button>
            {!token_hash && (
              <div className="text-red-400 text-base">
                Missing verification token. Please request a new confirmation email.
              </div>
            )}
            {error && <div className="text-red-400 text-base">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfirmEmailFallback() {
  return (
    <div className="bg-black w-full min-h-dvh flex flex-col items-center justify-center px-4 py-6 sm:px-8 sm:py-8 md:px-12">
      <Loader2
        className="h-10 w-10 animate-spin text-white"
        strokeWidth={2}
        aria-label="Loading"
      />
    </div>
  );
}

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={<ConfirmEmailFallback />}>
      <ConfirmEmailContent />
    </Suspense>
  );
}
