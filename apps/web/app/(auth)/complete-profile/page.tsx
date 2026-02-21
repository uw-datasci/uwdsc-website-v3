"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Typing } from "@/components/login/Typing";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getProfile } from "@/lib/api/profile";
import type { Profile } from "@uwdsc/common/types";
import { CompleteProfileForm } from "@/components/complete-profile";

export default function CompleteProfilePage() {
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined);
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
      <div className="bg-black w-full min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-black w-full min-h-screen flex flex-col items-center justify-center px-12 py-8">
      <div className="w-full mb-8">
        <Typing
          text="UW Data Science Club"
          speed={75}
          caretSize="text-[42px] font-semibold"
          className="text-3xl font-bold text-white"
        />
      </div>
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 w-full h-full max-w-6xl mx-auto">
          {/* Left Information Side */}
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
            <div className="text-center md:text-start">
              <h2 className="text-7xl font-bold my-10">Almost There!</h2>
              <div className="flex flex-col gap-8 leading-loose text-xl">
                <p>
                  Your email has been verified! Now let&apos;s complete your
                  profile to finish setting up your account.
                </p>
                <p>
                  And after all that hard work ... <br /> Welcome to the club!
                </p>
              </div>
            </div>
          </div>
          {/* Vertical Divider */}
          <div className="hidden md:block w-px self-stretch bg-gray-500/60" />
          {/* Right Input Side */}
          <div className="w-full h-full flex-1">
            <CompleteProfileForm
              prefill={profile ?? null}
              onSuccess={() => {
                mutate();
                router.push("/");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
