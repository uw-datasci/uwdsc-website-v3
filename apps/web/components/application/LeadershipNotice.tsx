"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { LeadershipSeat } from "@uwdsc/common/types";
import { Button } from "@uwdsc/ui";

const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL ?? "https://admin.uwdatascience.ca";

/** Shown on /apply to next term's presidents and VPs instead of the form. */
export function LeadershipNotice({ seat }: { readonly seat: LeadershipSeat }) {
  const fallback = seat.role === "pres" ? "a president" : "a VP";
  const recruitingUrl = new URL("/recruiting", ADMIN_URL).toString();
  const nextStep =
    seat.role === "pres"
      ? "Go run the club. The applicants are waiting."
      : "Go back to Recruiting and find your team.";

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <motion.div
        className="max-w-lg text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-400/20">
          <ShieldCheck className="h-10 w-10 text-blue-400" />
        </div>
        <h1 className="mb-4 text-3xl font-bold text-white">What are you doing here? 👀</h1>
        <p className="mb-2 text-lg text-grey1">
          You&apos;re literally {seat.positionName ?? fallback}. You don&apos;t fill out the form, you read it.
        </p>
        <p className="mb-6 text-lg text-grey1">{nextStep}</p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild className="p-5">
            <a href={recruitingUrl}>Open Recruiting</a>
          </Button>
          <Button asChild variant="outline" className="p-5">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
