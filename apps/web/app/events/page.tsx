"use client";

import { useEffect, useState } from "react";
import { getEventsByRange, getCheckInStatus, checkInToEvent } from "@/lib/api/events";
import { getMembershipStatus } from "@/lib/api/profile";
import type { Event, MembershipStatus } from "@uwdsc/common/types";
import { useAuth } from "@/contexts/AuthContext";
import {
  ActiveEventSection,
  EventCardMemberSection,
  MembershipPaymentDrawer,
  NextEventSection,
} from "@/components/events";
import { motion } from "framer-motion";
import { Badge, Button, Card, CardContent, CardHeader, Spinner } from "@uwdsc/ui";
import { QrCode as QrCodeIcon } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";

// Lazy so three.js stays out of the events bundle until a stamp is earned.
const GachaRevealModal = dynamic(
  () => import("@/components/gacha").then((m) => m.GachaRevealModal),
  { ssr: false },
);

export type CheckInState = "idle" | "success" | "noStamp" | "error";

export default function EventsPage() {
  const { user } = useAuth();
  const [activeEvents, setActiveEvents] = useState<Event[] | null>(null);
  const [nextEvent, setNextEvent] = useState<Event | null>(null);
  const [canCheckIn, setCanCheckIn] = useState(false);
  const [membershipStatus, setMembershipStatus] = useState<MembershipStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkInState, setCheckInState] = useState<CheckInState>("idle");
  const [checkInError, setCheckInError] = useState<string | null>(null);
  const [revealOpen, setRevealOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [activeResult, membershipResult] = await Promise.allSettled([
          getEventsByRange("active"),
          getMembershipStatus(),
        ]);

        const active = activeResult.status === "fulfilled" ? activeResult.value : [];

        const membership =
          membershipResult.status === "fulfilled"
            ? membershipResult.value
            : { has_membership: false, membership_id: null };

        setMembershipStatus(membership);

        setActiveEvents(active);
        setCanCheckIn(membership.has_membership);

        const firstActive = active[0];
        if (firstActive) {
          setNextEvent(null);
          const status = await getCheckInStatus(firstActive.id);
          setCheckInState(status.checkedIn ? "success" : "idle");
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
  }, [user?.id]);

  const currentEvent =
    activeEvents && activeEvents.length > 0 ? (activeEvents[0] ?? null) : null;
  const shouldShowPaymentQr = membershipStatus !== null && !membershipStatus.has_membership;

  const handleCheckIn = async () => {
    if (!currentEvent) return;
    setCheckingIn(true);
    setCheckInError(null);
    try {
      const result = await checkInToEvent(currentEvent.id);
      if (result.stampAwarded) {
        // Fresh stamp: play the reveal, land on the checked-in card after.
        setCheckInState("success");
        setRevealOpen(true);
      } else {
        setCheckInState("noStamp");
      }
    } catch (err) {
      setCheckInState("error");
      setCheckInError((err as Error).message);
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

              {canCheckIn ? (
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
                    canCheckIn={canCheckIn}
                    checkInState={checkInState}
                    checkInError={checkInError}
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

      {shouldShowPaymentQr ? (
        <MembershipPaymentDrawer
          profileId={user?.id ?? null}
          trigger={
            <Button
              variant="outline"
              size="lg"
              className="fixed bottom-4 left-1/2 z-200 -translate-x-1/2 backdrop-blur supports-backdrop-filter:bg-background/70"
            >
              <QrCodeIcon className="size-5" />
              Show Payment QR
            </Button>
          }
        />
      ) : null}

      <GachaRevealModal open={revealOpen} onClose={() => setRevealOpen(false)} />
    </div>
  );
}
