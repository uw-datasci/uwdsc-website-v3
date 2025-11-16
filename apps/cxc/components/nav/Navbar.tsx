"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import AppStepButton from "../application/AppStepButton";

export default function Navbar() {
  const router = useRouter();
  return (
    <div className="w-full px-8 py-6 flex items-center justify-between">
      {/* Left section - Logo and description */}
      <div className="flex items-start md:gap-20 lg:gap-24 xl:gap-36">
        {/* Logo */}
        <div className="relative w-12 h-12 sm:w-16 sm:h-16">
          <Image
            src="/logos/dsc.svg"
            alt="uwdsc logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Description */}
        <div className="hidden md:block text-white max-w-sm lg:max-w-lg">
          <p className="text-xs lg:text-sm leading-relaxed">
            Canada's largest student run data hackathon.
            <br />
            We are a beginner-friendly datathon that bring together students and
            companies to build projects that solve real-world problems.
          </p>
        </div>
      </div>

      {/* Sign up button */}
      <AppStepButton
        text="Sign up"
        onClick={() => router.push("/register")}
        className="!px-3 !py-2 text-base"
        marginLeft="ml-8"
        iconSize={16}
      />
    </div>
  );
}
