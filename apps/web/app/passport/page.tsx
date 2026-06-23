"use client";

import { useEffect, useState } from "react";
import { QrCode, UserRound } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getMembershipStatus } from "@/lib/api/profile";
import { FACULTY_LABELS } from "@uwdsc/common/constants";
import type { MembershipStatus } from "@uwdsc/common/types";
import { Spinner } from "@uwdsc/ui";

export default function PassportPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [membershipStatus, setMembershipStatus] = useState<MembershipStatus | null>(null);
  const [membershipLoading, setMembershipLoading] = useState(true);
  const [showQr, setShowQr] = useState(false);

  useEffect(() => {
    getMembershipStatus()
      .then(setMembershipStatus)
      .catch(console.error)
      .finally(() => setMembershipLoading(false));
  }, []);

  if (authLoading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-black">
        <Spinner className="size-8" />
      </div>
    );
  }

  const initials =
    [user?.first_name?.[0], user?.last_name?.[0]].filter(Boolean).join("").toUpperCase() || "?";
  const displayName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") || "Unknown Member";
  const isMember = Boolean(membershipStatus?.has_membership);
  const facultyLabel = user?.faculty == null ? undefined : FACULTY_LABELS[user.faculty];
  const detailBlocks = [
    { label: "Email", value: user?.email ?? "-" },
    { label: "WatIam", value: user?.wat_iam ?? "-" },
    { label: "Faculty", value: facultyLabel ?? "-" },
    { label: "Term", value: user?.term ?? "-" },
    { label: "Placeholder", value: "-" },
    { label: "Placeholder", value: "-" },
  ];

  return (
    <main className="flex min-h-dvh flex-col items-center bg-[#000000] px-4 pb-14 pt-24 lg:px-8 lg:pt-32">
      <section className="grid w-full max-w-5xl gap-4 lg:grid-cols-[minmax(320px,390px)_1fr] lg:gap-6">
        <div className="space-y-4 lg:sticky lg:top-30 lg:self-start">
          <div className="relative rounded-3xl border border-zinc-800 bg-[#0f0f11] p-4">
            <button
              type="button"
              onClick={() => setShowQr((prev) => !prev)}
              className="absolute left-3 top-3 z-10 inline-flex size-9 items-center justify-center rounded-full border border-zinc-700 bg-black/70 text-zinc-100 transition hover:bg-zinc-900"
              aria-label={showQr ? "Show profile" : "Show QR code"}
            >
              {showQr ? <UserRound className="size-4" /> : <QrCode className="size-4" />}
            </button>

            <div className="flex items-center justify-center py-3">
              {!showQr ? (
                <div className="relative size-52 rounded-full border-4 border-zinc-600/70 bg-zinc-950 p-2 shadow-[0_0_0_6px_rgba(63,63,70,0.35)] transition-all duration-300 sm:size-56">
                  <div className="flex size-full items-center justify-center rounded-full border border-zinc-700 bg-gradient-to-br from-sky-950 via-blue-900 to-zinc-900 text-5xl font-semibold text-white">
                    {initials}
                  </div>
                </div>
              ) : (
                <div className="relative size-52 rounded-full border-4 border-zinc-600/70 bg-white p-4 shadow-[0_0_0_6px_rgba(63,63,70,0.35)] transition-all duration-300 sm:size-56">
                  <div className="grid size-full grid-cols-11 grid-rows-11 gap-[2px] rounded-full bg-white p-1">
                    {Array.from({ length: 121 }).map((_, index) => (
                      <span
                        key={index}
                        className={
                          (index * 7 + index) % 5 === 0 || (index + 3) % 11 === 0
                            ? "rounded-[1px] bg-black"
                            : "rounded-[1px] bg-white"
                        }
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-700 to-violet-900 text-sm font-semibold text-white">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{displayName}</p>
                  <p className="truncate text-xs text-zinc-400">{user?.email ?? "No email"}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <span className="rounded-full bg-violet-600 px-2.5 py-1 text-[10px] font-semibold text-white">
                  {user?.exec_position_name ?? "Developer"}
                </span>
                {membershipLoading ? (
                  <span className="rounded-full border border-emerald-500/35 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
                    Checking
                  </span>
                ) : (
                  <span
                    className={
                      isMember
                        ? "rounded-full border border-emerald-500/35 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-300"
                        : "rounded-full border border-zinc-600 bg-zinc-800 px-2.5 py-1 text-[10px] font-semibold text-zinc-300"
                    }
                  >
                    {isMember ? "Active Member" : "Not Paid"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {detailBlocks.map(({ label, value }, index) => (
              <div
                key={`detail-${index}`}
                className="flex min-h-20 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-center sm:min-h-24"
              >
                <span className="text-xs font-medium text-zinc-400 sm:text-sm">
                  {label}: {value}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-1">
            <p className="text-xs font-bold lowercase tracking-wide text-zinc-500">my stamps</p>
            <div className="mt-3 flex flex-wrap items-center gap-3 pb-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <span
                  key={`stamp-${index}`}
                  className="size-6 shrink-0 rounded-full bg-zinc-300"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
