"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Typing } from "@/components/login/Typing";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getProfile } from "@/lib/api/profile";
import type { Profile } from "@uwdsc/common/types";
import { CompleteProfileForm, CompleteProfileSuccessView } from "@/components/complete-profile";

export default function CompleteProfilePage() {
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const router = useRouter();
  const { user, isLoading: isAuthLoading, mutate } = useAuth();

  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    getProfile()
      .then((p: Profile) => {
        if (cancelled) return;
        setProfile(p);
      })
      .catch((err) => {
        if (!cancelled) console.error("Failed to load profile for prefill:", err);
        setProfile(null);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    if (!isAuthLoading && !user) router.push("/login");
  }, [isAuthLoading, user, router]);

  if (isAuthLoading || !user) {
    return (
      <div className="bg-black flex min-h-dvh w-full items-center justify-center px-4">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-black flex min-h-dvh w-full flex-col items-center overflow-x-hidden px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-6 sm:py-8 md:px-8 lg:px-12">
      <div className="mb-6 w-full max-w-6xl shrink-0 text-center sm:mb-8 md:text-left">
        <Typing
          text="UW Data Science Club"
          speed={75}
          caretSize="text-2xl font-semibold sm:text-3xl md:text-[42px]"
          className="text-xl font-bold text-white sm:text-2xl md:text-3xl"
        />
      </div>
      <div className="relative flex min-h-0 w-full max-w-6xl flex-1 flex-col sm:min-h-[min(55vh,420px)] md:min-h-[min(70vh,560px)]">
        <AnimatePresence mode="wait">
          {isProfileComplete ? (
            <motion.div
              key="profile-success"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0 flex w-full flex-col items-center justify-start overflow-y-auto overscroll-y-contain sm:justify-center"
            >
              <CompleteProfileSuccessView />
            </motion.div>
          ) : (
            <motion.div
              key="profile-form"
              initial={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0 flex w-full items-start justify-center overflow-y-auto overscroll-y-contain md:items-center"
            >
              <div className="mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-6 md:h-full md:flex-row md:gap-8 md:items-center lg:gap-12">
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-5 md:gap-8">
                  <div className="relative mx-auto h-20 w-20 shrink-0 md:mx-0 md:h-40 md:w-40">
                    <Image
                      src="/logos/dsc.svg"
                      alt="uwdsc logo"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                  <div className="text-center md:text-start">
                    <h2 className="my-4 text-4xl font-bold tracking-tight sm:my-6 sm:text-5xl md:my-10 md:text-6xl lg:text-7xl">
                      Almost There!
                    </h2>
                    <div className="flex flex-col gap-4 text-base leading-relaxed text-white/90 sm:gap-6 sm:text-lg md:gap-8 md:text-xl md:leading-loose">
                      <p>
                        Your email has been verified! Now let&apos;s complete your profile to
                        finish setting up your account.
                      </p>
                      <p>
                        And after all that hard work ... <br /> Welcome to the club!
                      </p>
                    </div>
                  </div>
                </div>
                <div className="hidden w-px shrink-0 self-stretch bg-gray-500/60 md:block" />
                <div className="flex min-w-0 w-full flex-1 items-stretch pb-2 md:items-center md:pb-0">
                  <CompleteProfileForm
                    prefill={profile ?? null}
                    onSuccess={async () => {
                      await mutate();
                      setIsProfileComplete(true);
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
