"use client";

import { useEffect, useState } from "react";
import {
  getEventsByRange,
  getCheckInStatus,
  checkInToEvent,
} from "@/lib/api/events";
import { getMembershipStatus } from "@/lib/api/profile";
import type { Event, MembershipStatus } from "@uwdsc/common/types";
import {
  ActiveEventSection,
  EventCardMemberSection,
  NextEventSection,
} from "@/components/events";
import { motion } from "framer-motion";
import { Badge, Card, CardContent, CardHeader, Spinner } from "@uwdsc/ui";
import Image from "next/image";

export default function EventsPage() {
  const [activeEvents, setActiveEvents] = useState<Event[] | null>(null);
  const [nextEvent, setNextEvent] = useState<Event | null>(null);
  const [membershipStatus, setMembershipStatus] =
    useState<MembershipStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkInSuccess, setCheckInSuccess] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [activeResult, membershipResult] = await Promise.allSettled([
          getEventsByRange("active"),
          getMembershipStatus(),
        ]);

        const active =
          activeResult.status === "fulfilled" ? activeResult.value : [];
        const membership =
          membershipResult.status === "fulfilled"
            ? membershipResult.value
            : { has_membership: false, membership_id: null };

        setActiveEvents(active);
        setMembershipStatus(membership);

        const firstActive = active[0];
        if (firstActive) {
          setNextEvent(null);
          const status = await getCheckInStatus(firstActive.id);
          setCheckInSuccess(status.checkedIn);
        } else {
          const next = await getEventsByRange("next");
          setNextEvent(next);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const currentEvent =
    activeEvents && activeEvents.length > 0 ? (activeEvents[0] ?? null) : null;

  const handleCheckIn = async () => {
    if (!currentEvent) return;
    setCheckingIn(true);
    try {
      await checkInToEvent(currentEvent.id);
      setCheckInSuccess(true);
    } catch (err) {
      alert("Failed to check in: " + (err as Error).message);
    } finally {
      setCheckingIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Spinner className="size-8 text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh sm:min-h-[80vh] flex flex-col items-center justify-center px-3 py-4 sm:p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] max-w-2xl max-h-2xl bg-emerald-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <motion.div className="w-full max-w-[500px] flex justify-center">
        <Card className="relative w-full max-w-[500px] aspect-3/4 min-h-[420px] sm:min-h-0 overflow-hidden shadow-2xl group border-0 p-0 bg-transparent flex flex-col">
          <Image
            src="/membership/memCardBg.svg"
            alt="Membership Card"
            fill
            priority
            className="object-cover z-0 transition-transform duration-1000 group-hover:scale-105"
          />

          <div className="absolute inset-0 z-10 bg-linear-to-br from-black/40 via-black/20 to-black/80 backdrop-blur-sm p-4 sm:p-6 md:p-8 flex flex-col justify-between transition-colors duration-500">
            <CardHeader className="flex flex-row flex-wrap justify-between items-start gap-2 sm:gap-0 sm:flex-nowrap space-y-0 p-0">
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ duration: 0.3 }}
                className="min-w-0"
              >
                <h2 className="text-xl sm:text-2xl font-black tracking-[0.15em] sm:tracking-[0.2em] text-white drop-shadow-lg">
                  UWDSC
                </h2>
                <p className="text-[10px] sm:text-xs text-white/70 tracking-widest uppercase mt-0.5 sm:mt-1 font-medium">
                  Data Science Club
                </p>
              </motion.div>

              {membershipStatus?.has_membership ? (
                <Badge
                  variant="outline"
                  className="shrink-0 bg-emerald-500/20 text-emerald-300 border-emerald-500/50 text-[10px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-bold tracking-widest sm:tracking-[0.15em] shadow-[0_0_20px_rgba(16,185,129,0.4)] backdrop-blur-md"
                >
                  ACTIVE MEMBER
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="shrink-0 bg-red-500/20 text-red-300 border-red-500/50 text-[10px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-bold tracking-widest sm:tracking-[0.15em] backdrop-blur-md"
                >
                  NOT PAID
                </Badge>
              )}
            </CardHeader>

            <EventCardMemberSection />

            <CardContent className="p-0 min-h-0 flex flex-col">
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="min-h-0"
              >
                {currentEvent ? (
                  <ActiveEventSection
                    event={currentEvent}
                    membershipStatus={membershipStatus}
                    checkInSuccess={checkInSuccess}
                    checkingIn={checkingIn}
                    onCheckIn={handleCheckIn}
                  />
                ) : (
                  <NextEventSection nextEvent={nextEvent} />
                )}
              </motion.div>
            </CardContent>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
