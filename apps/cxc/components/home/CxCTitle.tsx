"use client";

import { CountdownClock } from "../CountdownClock";
import CxCButton from "../CxCButton";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Badge,
  Meteors,
  TypingAnimation,
  WarpBackground,
} from "@uwdsc/ui/index";
import Image from "next/image";
import { useIsMobile } from "@/hooks/useIsMobile";
import { APPLICATION_RELEASE_DATE } from "@/constants/application";

export default function CxCTitle() {
  const eventDate = useMemo(() => APPLICATION_RELEASE_DATE, []);
  const [mounted, setMounted] = useState(false);
  const [countdownOver, setCountdownOver] = useState(false);
  const isMobile = useIsMobile(640);
  const isTablet = useIsMobile(1024);
  const [cursorDone, setCursorDone] = useState(false);
  const [logoVisible, setLogoVisible] = useState(false);

  useEffect(() => {
    const checkCountdown = () => {
      const now = Date.now();
      const difference = eventDate.getTime() - now;

      if (difference <= 0) {
        setCountdownOver(true);
      }
    };
    checkCountdown();
    const interval = setInterval(checkCountdown, 1000);
    setMounted(true);

    return () => clearInterval(interval);
  }, [eventDate]);

  return (
    <div
      className={`relative border-b border-white/50 flex flex-col items-center justify-center ${countdownOver ? "overflow-hidden" : ""}`}
    >
      {mounted && (
        <AnimatePresence mode="wait">
          {countdownOver ? (
            <WarpBackground
              perspective={isMobile ? 80 : 250}
              className="w-full"
            >
              <motion.div
                key="cxc-logo-section"
                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{
                  duration: 1.2,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
                className="flex flex-col items-center py-16 md:py-28"
              >
                <div className="relative w-64 h-28 md:w-96 md:h-40 mb-8">
                  <Image
                    src="/logos/cxc_logo.svg"
                    alt="CXC"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="flex flex-col items-center gap-6 md:gap-8 justify-center absolute -bottom-12 md:-bottom-10">
                  <div className="flex flex-col items-center">
                    <Badge
                      className="mb-2 md:mb-3 font-normal text-sm md:text-base border-white/50 bg-background"
                      variant="outline"
                    >
                      FEB 6-8 · An AI Hackathon
                    </Badge>
                    <div className="flex flex-row items-center">
                      <TypingAnimation
                        className="font-light text-xl sm:text-2xl lg:text-3xl text-white/80"
                        showCursor={true}
                        onComplete={() => {
                          setLogoVisible(true);
                          setCursorDone(true);
                        }}
                        cursorElement={
                          <span className="inline-flex items-center ml-1.5">
                            <motion.img
                              src="/logos/tangerine_cursor.png"
                              alt="tangerine-cursor"
                              initial={{ x: 0, y: 0, rotate: -120 }}
                              animate={
                                cursorDone
                                  ? {
                                      x: isMobile ? 125 : isTablet ? 148 : 173,
                                      y: isMobile ? -6 : isTablet ? -8 : -10,
                                      rotate: 0,
                                    }
                                  : {
                                      x: 0,
                                      y: 0,
                                      rotate: -120,
                                    }
                              }
                              transition={{
                                type: "tween",
                                ease: [0.22, 1, 0.36, 1],
                                duration: 0.8,
                              }}
                              className="inline-block w-4.5 h-4.5 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
                            />
                          </span>
                        }
                      >
                        Presented by
                      </TypingAnimation>
                      <motion.img
                        src="/logos/tangerine_logo.png"
                        alt="tangerine-logo"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={
                          logoVisible
                            ? { opacity: 1, scale: 1 }
                            : { opacity: 0, scale: 0 }
                        }
                        transition={{
                          duration: 0.8,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="w-36 h-8 sm:w-42 sm:h-9 lg:w-48 lg:h-10 object-contain -ml-5"
                      />
                    </div>
                  </div>
                  <CxCButton
                    asChild
                    className="text-base md:text-2xl py-2 md:py-3 px-10 md:px-14 hover:scale-105"
                  >
                    <Link href="/apply">Apply</Link>
                  </CxCButton>
                </div>
              </motion.div>
            </WarpBackground>
          ) : (
            <motion.div
              key="countdown-section"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="relative w-full h-full overflow-hidden select-none"
            >
              <Meteors />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col items-center gap-4 sm:gap-6 pb-6 mt-5"
              >
                <div className="flex flex-col items-center z-10">
                  <div className="relative w-64 h-28 lg:w-96 lg:h-42">
                    <Image
                      src="/logos/cxc_logo.svg"
                      alt="CXC"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <Badge
                    className="font-normal text-base border-white/50 bg-background"
                    variant="outline"
                  >
                    FEB 6-8 · An AI Hackathon
                  </Badge>
                  <div className="flex flex-row items-center">
                    <TypingAnimation
                      className="font-light text-xl sm:text-2xl lg:text-3xl text-white/80"
                      showCursor={true}
                      onComplete={() => {
                        setLogoVisible(true);
                        setCursorDone(true);
                      }}
                      cursorElement={
                        <span className="inline-flex items-center ml-1.5">
                          <motion.img
                            src="/logos/tangerine_cursor.png"
                            alt="tangerine-cursor"
                            initial={{ x: 0, y: 0, rotate: -120 }}
                            animate={
                              cursorDone
                                ? {
                                    x: isMobile ? 125 : isTablet ? 148 : 173,
                                    y: isMobile ? -6 : isTablet ? -8 : -10,
                                    rotate: 0,
                                  }
                                : {
                                    x: 0,
                                    y: 0,
                                    rotate: -120,
                                  }
                            }
                            transition={{
                              type: "tween",
                              ease: [0.22, 1, 0.36, 1],
                              duration: 0.8,
                            }}
                            className="inline-block w-4.5 h-4.5 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
                          />
                        </span>
                      }
                    >
                      Presented by
                    </TypingAnimation>
                    <motion.img
                      src="/logos/tangerine_logo.png"
                      alt="tangerine-logo"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={
                        logoVisible
                          ? { opacity: 1, scale: 1 }
                          : { opacity: 0, scale: 0 }
                      }
                      transition={{
                        duration: 0.8,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="w-36 h-8 sm:w-42 sm:h-9 lg:w-48 lg:h-10 object-contain -ml-5"
                    />
                  </div>
                </div>

                <CountdownClock
                  targetDate={eventDate}
                  className="mb-4 relative z-10"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
