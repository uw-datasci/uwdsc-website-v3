"use client";

import { ReactNode } from "react";
import Image from "next/image";
import { useApplicationProgress } from "@/contexts/AppProgressContext";

export function ApplicationBackground({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { progressValue } = useApplicationProgress();

  return (
    <>
      {/* Multi-step application progress bar */}
      <progress
        value={progressValue}
        max={5}
        className="fixed top-0 left-0 p-0 [&::-webkit-progress-value]:duration-700[&::-webkit-progress-value]:ease-in-out z-50 m-0 block h-2 w-full transition-all duration-700 ease-in-out [&::-moz-progress-bar]:bg-blue-300 [&::-moz-progress-bar]:transition-all [&::-moz-progress-bar]:duration-700 [&::-moz-progress-bar]:ease-in-out  [&::-webkit-progress-value]:bg-blue-300 [&::-webkit-progress-value]:transition-all"
      />

      <div className="relative min-h-screen overflow-hidden px-4 py-20 shadow-md backdrop-blur-md">
        {/* Background Elements */}
        <div className="pointer-events-none absolute inset-0 z-0">
          {/* Left Whale */}
          <div className="absolute">
            <Image
              src="/execApps/B-light-bulb.svg"
              alt="whale with light bulb"
              width={450}
              height={450}
              style={{ width: "auto" }}
              priority
            />
          </div>

          {/* Right Whale on Cloud */}
          <div className="absolute right-0 top-[10%] translate-x-1/3 transform">
            <Image
              src="/execApps/B-float.svg"
              alt="whale floating on cloud"
              width={500}
              height={500}
              style={{ width: "auto" }}
              priority
            />
          </div>
        </div>

        {/* Main Content - positioned above background */}
        <div className="relative z-10">{children}</div>
      </div>
    </>
  );
}
