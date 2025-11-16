"use client";

import {
  DesktopAppWormhole,
  MobileAppWormhole,
} from "@/components/application/AppWormhole";
import AppStepButton from "@/components/application/AppStepButton";
import { useRouter } from "next/navigation";

export default function StartPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen h-full cxc-app-font">
      {/* Desktop View */}
      <div className="hidden md:flex flex-col md:flex-row justify-between min-h-screen h-full">
        <div className="block border-r border-white/50 md:w-1/2 relative">
          <div className="absolute inset-0">
            <DesktopAppWormhole />
          </div>

          <div className="absolute bottom-0 left-0 py-32 px-12 z-10">
            <h1 className="md:text-6xl lg:text-7xl xl:text-8xl mb-12">
              Welcome!
            </h1>
            <p className="text-sm lg:text-base">
              Canada's largest student run data hackathon. We are a
              beginner-friendly datathon that bring together students and
              companies to build projects that solve real-world problems.
            </p>
          </div>
        </div>
        <div className="px-4 py-12 overflow-hidden md:w-1/2 flex flex-col gap-12 justify-end px-12 py-32">
          <h1 className="text-6xl lg:text-7xl">
            Start
            <br />
            application
          </h1>
          <div className="flex flex-wrap gap-8 font-normal">
            <AppStepButton
              text="Log in"
              onClick={() => router.push("/login")}
              className="!px-4.5 !py-4 text-xl"
            />
            <AppStepButton
              text="Sign up"
              onClick={() => router.push("/register")}
              className="!px-4.5 !py-4 text-xl"
            />
          </div>
        </div>
      </div>
      {/* Mobile View */}
      <div className="md:hidden relative min-h-screen">
        <div className="absolute inset-0 -z-10">
          <MobileAppWormhole opacity={0.8} />
        </div>
        <div className="relative min-h-screen z-10 p-8 overflow-hidden flex flex-col gap-12 justify-center items-center">
          <div className="text-center">
            <h1 className="text-7xl mb-6">Welcome!</h1>
            <p className="text-sm lg:text-base">
              Canada's largest student run data hackathon. We are a
              beginner-friendly datathon that bring together students and
              companies to build projects that solve real-world problems.
            </p>
          </div>
          <div className="flex flex-wrap gap-8 font-normal">
            <AppStepButton
              text="Log in"
              onClick={() => router.push("/login")}
              className="!px-3 !py-2 text-base"
              marginLeft="ml-8"
              iconSize={16}
            />
            <AppStepButton
              text="Sign up"
              onClick={() => router.push("/register")}
              className="!px-3 !py-2 text-base"
              marginLeft="ml-8"
              iconSize={16}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
