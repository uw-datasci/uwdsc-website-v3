"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, cn } from "@uwdsc/ui";
import Link from "next/link";
import CxCButton from "../CxCButton";
import type { AppStatus } from "@/types/application";
import { APPLICATION_DEADLINE } from "@/constants/application";

interface StatusCardProps {
  status: AppStatus | null;
  submittedAt?: Date | null;
}

const statusConfig: Record<
  AppStatus,
  { label: string; color: string; borderColor: string; description: string }
> = {
  draft: {
    label: "DRAFT",
    color: "text-yellow-400",
    borderColor: "border-yellow-400",
    description: "Your application is saved but not submitted yet.",
  },
  submitted: {
    label: "SUBMITTED",
    color: "text-blue-400",
    borderColor: "border-blue-400",
    description: "Your application is under review. We'll notify you soon!",
  },
  offered: {
    label: "ACCEPTED",
    color: "text-green-400",
    borderColor: "border-green-400",
    description:
      "Congratulations! You've been accepted. Please confirm your attendance.",
  },
  accepted: {
    label: "CONFIRMED",
    color: "text-emerald-400",
    borderColor: "border-emerald-400",
    description: "You're all set! We can't wait to see you at CxC.",
  },
  rejected: {
    label: "NOT SELECTED",
    color: "text-red-400",
    borderColor: "border-red-400",
    description: "Unfortunately, we couldn't offer you a spot this time.",
  },
  waitlisted: {
    label: "WAITLISTED",
    color: "text-orange-400",
    borderColor: "border-orange-400",
    description:
      "You're on our waitlist. We'll contact you if a spot opens up.",
  },
};

export function StatusCard({ status, submittedAt }: Readonly<StatusCardProps>) {
  const config = status ? statusConfig[status] : null;
  const [isPastDeadline, setIsPastDeadline] = useState(false);

  useEffect(() => {
    const checkDeadline = () => {
      setIsPastDeadline(new Date() > APPLICATION_DEADLINE);
    };

    checkDeadline();
    const interval = setInterval(checkDeadline, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="bg-black border border-white/20 rounded-none !gap-0">
        <CardHeader className="border-b border-white/10">
          <CardTitle className="text-white flex items-center justify-between">
            <span className="uppercase tracking-wider text-sm">
              Application Status
            </span>
            {config && (
              <span
                className={cn(
                  "text-sm font-mono border px-3 py-1",
                  config.color,
                  config.borderColor,
                )}
              >
                {config.label}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {status === null ? (
            <div className="space-y-6">
              {isPastDeadline ? (
                <div className="border border-red-400/40 bg-red-400/10 p-4">
                  <p className="text-red-400 font-medium mb-1 font-mono">
                    Application deadline passed.
                  </p>
                  <p className="text-red-400/70 text-sm">
                    The application deadline has passed. We are no longer accepting
                    new applications.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-white/60">
                    You haven&apos;t started your application yet. Apply now to join
                    CxC!
                  </p>
                  <Link href="/apply">
                    <CxCButton className="w-full sm:w-auto">
                      Start Application →
                    </CxCButton>
                  </Link>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-white/60">{config?.description}</p>

              {submittedAt && (
                <p className="text-white/40 text-sm font-mono">
                  Submitted:{" "}
                  {new Date(submittedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}

              {status === "draft" && (
                <>
                  {isPastDeadline ? (
                    <div className="border border-red-400/40 bg-red-400/10 p-4">
                      <p className="text-red-400 font-medium mb-1 font-mono">
                        Application deadline passed.
                      </p>
                      <p className="text-red-400/70 text-sm">
                        The application deadline has passed. We are no longer
                        accepting applications or allowing edits to draft
                        applications.
                      </p>
                    </div>
                  ) : (
                    <Link href="/apply">
                      <CxCButton className="w-full sm:w-auto">
                        Continue Application →
                      </CxCButton>
                    </Link>
                  )}
                </>
              )}

              {status === "offered" && (
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <CxCButton className="flex-1">Confirm Attendance</CxCButton>
                  <CxCButton
                    className="flex-1 !bg-transparent !text-white border border-white/20 hover:!bg-white/10"
                    disabled
                  >
                    Decline
                  </CxCButton>
                  <p className="text-xs text-white/40 sm:hidden">
                    RSVP functionality coming soon
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
