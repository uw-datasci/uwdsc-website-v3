"use client";

import { signOut } from "@/lib/api";
import { AuthUser } from "@/types/api";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CountingNumber, GlassSurface } from "@uwdsc/ui";

interface HeroProps {
  user: AuthUser | null;
  mutate: () => Promise<void>;
}

export default function Hero({ user, mutate }: Readonly<HeroProps>) {
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
      <div className="absolute left-3 top-24 flex flex-col gap-1 md:gap-3 items-center sm:left-6 sm:top-32">
        <div className="text-black dark:text-white text-3xl lg:text-5xl">
          <CountingNumber number={memberCount} inViewOnce={true} />
          <span className="">+</span>
        </div>
        <p className="font-mono text-xl lg:text-2xl">{`{ MEMBERS }`}</p>
      </div>
      {/* Events Stat */}
      <div className="absolute bottom-10 right-3 flex flex-col gap-1 md:gap-3 items-center sm:bottom-20 sm:right-6">
        <div className="text-black dark:text-white text-3xl lg:text-5xl">
          <CountingNumber number={eventCount} inViewOnce={true} />
          <span className="">+</span>
        </div>
        <p className="font-mono text-xl lg:text-2xl">{`{ EVENTS }`}</p>
      </div>

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
      {user ? (
        <div className="flex flex-row gap-4 lg:hidden z-10 text-center text-grey1 py-6 text-sm md:text-base md:py-8">
          <p>
            Logged in as <b>{user?.first_name + " " + user?.last_name}</b>
          </p>
          <button
            onClick={handleSignOut}
            className="hover:cursor-pointer hover:underline"
          >
            ( Log Out )
          </button>
        </div>
      ) : (
        <div className="lg:hidden z-10 py-6 md:py-8 hover: cursor-pointer">
          <GlassSurface
            width="100%"
            height="auto"
            borderRadius={9999}
            className="px-3 py-1 md:px-6 md:py-3 overflow-visible! hover:cursor-pointer hover:scale-105 transition-transform duration-200"
          >
            <Link
              href="/login"
              className="text-base md:text-xl font-medium flex items-center w-full justify-center hover:cursor-pointer"
            >
              Log in →
            </Link>
          </GlassSurface>
        </div>
      )}

      {/* Check-in button */}
      <div className={`z-10 w-fit lg:mt-10`}>
        <GlassSurface
          width="100%"
          height="auto"
          borderRadius={9999}
          className={`${user ? "px-4 py-2" : "px-3 py-1"} md:px-6 md:py-3 overflow-visible! hover:cursor-pointer hover:scale-105 transition-transform duration-200`}
        >
          <Link
            href={user ? "/check-in" : "/register"}
            className="text-base md:text-xl font-medium flex items-center w-full justify-center hover:cursor-pointer"
          >
            {user ? "Check in for an event →" : "Sign up →"}
          </Link>
        </GlassSurface>
      </div>

      {/* Sponsor Us Link */}
      <motion.button
        className="p-3 text-xl mt-3 md:mt-0 hover:cursor-pointer md:block md:absolute md:bottom-20 md:left-6 md:text-2xl"
        onClick={() => (globalThis.location.href = "#contact")}
        whileHover="hover"
        initial="initial"
      >
        <p className="relative md:text-xl xl:text-2xl">
          <motion.span
            className="absolute bottom-0 left-0 h-0.5 bg-white cursor-pointer"
            variants={{
              initial: { width: "0%" },
              hover: { width: "100%" },
            }}
            transition={{ duration: 0.2 }}
          ></motion.span>
          Sponsor us →
        </p>
      </motion.button>
    </section>
  );
}
