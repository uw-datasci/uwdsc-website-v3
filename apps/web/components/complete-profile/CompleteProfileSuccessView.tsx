"use client";

import Link from "next/link";
import { PartyPopper } from "lucide-react";
import { Button } from "@uwdsc/ui";
import {
  MEMBERSHIP_INBOUND_EMAIL,
  MEMBERSHIP_MONERIS_RECEIPT_FROM,
  MEMBERSHIP_PAYMENT_URL,
} from "@uwdsc/common/constants";

export function CompleteProfileSuccessView() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center px-3 py-4 text-center text-white sm:px-4 sm:py-6">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full" />
        <PartyPopper
          className="relative w-20 h-20 text-purple-400"
          strokeWidth={1.5}
          aria-hidden
        />
      </div>
      <h2 className="mb-3 text-3xl font-bold sm:mb-4 sm:text-4xl md:text-5xl">
        Profile complete
      </h2>
      <p className="mb-6 text-base text-gray-300 sm:mb-8 sm:text-lg">
        Your account is set up. One more step: pay the DSC membership fee so you can access all
        member benefits.
      </p>

      <div className="mb-6 w-full rounded-xl border border-gray-700/80 bg-black/40 p-4 text-left sm:mb-8 sm:p-6">
        <h3 className="text-base font-semibold text-white mb-3">
          Ways to pay the $4 membership fee
        </h3>
        <ul className="list-disc pl-5 space-y-3 text-gray-300 text-sm md:text-base leading-relaxed">
          <li>
            <strong className="text-gray-200">WUSA online</strong> - Shop → Memberships → DSC.
            After you pay,{" "}
            <strong className="text-gray-200">forward the Moneris payment receipt</strong> (from{" "}
            <span className="font-mono font-bold text-purple-200 break-all">
              {MEMBERSHIP_MONERIS_RECEIPT_FROM}
            </span>
            , not the WUSA order summary email) to{" "}
            <span className="font-mono font-bold text-purple-200 break-all">
              {MEMBERSHIP_INBOUND_EMAIL}
            </span>{" "}
            from the <strong className="text-gray-200">same email address</strong> you use for
            this club account so we can activate your membership automatically.
          </li>
          <li>
            <strong className="text-gray-200">Cash</strong> at our office or in-person events.
          </li>
          <li>
            <strong className="text-gray-200">Credit or debit</strong> at the MathSoc office
            (keep your receipt).
          </li>
        </ul>
        <p className="mt-4 text-sm text-gray-400">
          <a
            href={MEMBERSHIP_PAYMENT_URL}
            className="text-purple-300 underline underline-offset-2 hover:text-purple-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open the membership payment page
          </a>{" "}
          (WUSA checkout)
        </p>
      </div>

      <Button
        asChild
        size="lg"
        className="w-full max-w-md rounded-lg bg-gradient-purple px-6 py-6 text-base font-bold hover:opacity-90 sm:w-auto sm:px-10 sm:text-lg"
      >
        <Link href="/">Continue to home</Link>
      </Button>
    </div>
  );
}
