"use client";

import { signOut } from "@/lib/api";
import { UserProfile } from "@/types/api";
import { CountingNumber, GlassSurface } from "@uwdsc/ui/index";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface HeroProps {
  profile: UserProfile | null;
  mutate: () => Promise<UserProfile | null | undefined>;
}

export default function Hero({ profile, mutate }: HeroProps) {
  const [memberCount, setMemberCount] = useState(350); // TODO: update count from db
  const [eventCount, setEventCount] = useState(20); // TODO: update count from db
  const router = useRouter();
  const handleSignOut = async () => {
    try {
      await signOut();
      // Revalidate the auth state
      await mutate();
      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/spinning_globe.mp4" type="video/mp4" />
      </video>

      {/* Absolutely Positioned Info */}
      {/* Members Stat */}
      <div className="absolute left-3 top-24 flex flex-col gap-3 items-center sm:left-6 sm:top-32">
        <div className="text-black dark:text-white text-4xl lg:text-5xl">
          <CountingNumber number={memberCount} inViewOnce={true} />
          <span className="">+</span>
        </div>
        <p className="font-mono text-xl lg:text-2xl">{`{ MEMBERS }`}</p>
      </div>
      {/* Events Stat */}
      <div className="absolute bottom-10 right-3 flex flex-col gap-3 items-center sm:bottom-20 sm:right-6">
        <div className="text-black dark:text-white text-4xl lg:text-5xl">
          <CountingNumber number={eventCount} inViewOnce={true} />
          <span className="">+</span>
        </div>
        <p className="font-mono text-xl lg:text-2xl">{`{ EVENTS }`}</p>
      </div>
      {/* Sponsor Us Link */}
      <motion.button
        className="p-3 text-xl hover:cursor-pointer hidden md:block md:absolute md:bottom-20 md:left-6 md:mb-0 md:text-2xl"
        onClick={() => (window.location.href = "#contact")}
        whileHover="hover"
        initial="initial"
      >
        <p className="relative md:text-xl xl:text-2xl">
          <motion.span
            className="absolute bottom-0 left-0 h-[2px] bg-white cursor-pointer"
            variants={{
              initial: { width: "0%" },
              hover: { width: "100%" },
            }}
            transition={{ duration: 0.2 }}
          ></motion.span>
          Sponsor us →
        </p>
      </motion.button>

      {/* Title + Description */}
      <div className="z-10 mt-20 flex max-w-4xl flex-col gap-6 px-8 sm:gap-10 text-center">
        <h1 className="text-3xl font-bold sm:text-5xl md:text-6xl xl:text-7xl leading-normal tracking-wide">
          University of Waterloo <br /> Data Science Club
        </h1>
        <p className="mx-auto max-w-md md:max-w-2xl text-sm sm:text-xl">
          Inspiring the data science leaders of the future by building an
          inclusive community to bridge the gap between academics and the
          industry.
        </p>
      </div>
      {profile ? (
        <div className="flex flex-row gap-4 lg:hidden z-10 text-center text-[var(--grey1)] py-6 text-sm md:text-base md:py-8">
          <p>
            Logged in as <b>{profile?.first_name + " " + profile?.last_name}</b>
          </p>
          <button
            onClick={handleSignOut}
            className="hover:cursor-pointer hover:underline"
          >
            ( Log Out )
          </button>
        </div>
      ) : (
        <button
          className="z-10 py-6 md:py-8 hover: cursor-pointer"
          onClick={() => {
            router.push("/register");
          }}
        >
          Sign in →
        </button>
      )}

      {/* Check-in button */}
      <motion.div
        className={`z-10 w-fit ${profile ? "lg:mt-10" : ""}`}
        initial="initial"
        whileHover="hover"
      >
        <GlassSurface
          width="100%"
          height="auto"
          borderRadius={9999}
          className="px-4 py-2 md:px-6 md:py-3 !overflow-visible hover:cursor-pointer"
        >
          <button
            className="text-base md:text-xl font-medium flex items-center w-full justify-center hover:cursor-pointer"
            onClick={() => {
              if (profile) router.push("/memCheckIn");
              else router.push("/login");
            }}
          >
            Check in for an event
            <motion.span
              className="inline-block ml-2"
              variants={{
                initial: { width: 0, opacity: 0 },
                hover: { width: "auto", opacity: 1 },
              }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              →
            </motion.span>
          </button>
        </GlassSurface>
      </motion.div>
    </section>
  );
}
