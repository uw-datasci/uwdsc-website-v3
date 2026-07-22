"use client";

import { useEffect, useState } from "react";
import { PassportCard } from "@/components/passport";
import { useAuth } from "@/contexts/AuthContext";
import { getMembershipStatus } from "@/lib/api/profile";
import { FACULTY_LABELS } from "@uwdsc/common/constants";
import type { MembershipStatus } from "@uwdsc/common/types";
import { Spinner } from "@uwdsc/ui";

export default function PassportPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [membershipStatus, setMembershipStatus] =
    useState<MembershipStatus | null>(null);
  const [membershipLoading, setMembershipLoading] = useState(true);

  const demoStamps = [
    { label: "Hack Night", accent: "from-cyan-300 to-sky-500", mark: "DSC" },
    { label: "Workshop", accent: "from-amber-300 to-orange-500", mark: "101" },
    { label: "Social", accent: "from-fuchsia-300 to-pink-500", mark: "FRI" },
    { label: "Datathon", accent: "from-emerald-300 to-teal-500", mark: "202" },
    { label: "Speaker", accent: "from-violet-300 to-indigo-500", mark: "LIVE" },
    { label: "Bonus", accent: "from-rose-300 to-red-500", mark: "+1" },
  ] as const;

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
    [user?.first_name?.[0], user?.last_name?.[0]]
      .filter(Boolean)
      .join("")
      .toUpperCase() || "?";

  const displayName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    "Unknown Member";

  const isMember = Boolean(membershipStatus?.has_membership);

  const facultyLabel =
    user?.faculty == null ? undefined : FACULTY_LABELS[user.faculty];

  return (
    <main className="flex min-h-dvh flex-col items-center px-4 pb-16 pt-28 lg:pt-32">
      <div className="w-full max-w-2xl space-y-4">
        <PassportCard
          userId={user?.id ?? ""}
          membershipId={membershipStatus?.membership_id ?? null}
          initials={initials}
          displayName={displayName}
          email={user?.email}
          membershipLoading={membershipLoading}
          isMember={isMember}
          execPositionLabel={user?.exec_position_name}
          facultyLabel={facultyLabel}
          term={user?.term ?? undefined}
        />

        <div className="pt-1">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
                my stamps
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                Scroll sideways to see more stamps.
              </p>
            </div>

            <span className="rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
              6 demo stamps
            </span>
          </div>

          <div className="mt-3 w-full max-w-full overflow-x-auto overscroll-x-contain pb-2">
            <div className="flex w-max gap-4 pr-1">
              {demoStamps.map(({ label, accent, mark }, index) => (
                <div
                  key={`stamp-${label}`}
                  className="group relative min-w-36 shrink-0 snap-start overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-3 shadow-[0_14px_30px_rgba(0,0,0,0.28)]"
                >
                  <div
                    className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`}
                  />

                  <div className="flex min-h-32 flex-col justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                        Stamp {index + 1}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-white">
                        {label}
                      </p>
                    </div>

                    <div className="mt-3 flex flex-1 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-3 py-4">
                      <div
                        className={`flex size-[4.5rem] items-center justify-center rounded-full bg-gradient-to-br ${accent} text-sm font-black tracking-[0.18em] text-white shadow-[0_12px_24px_rgba(0,0,0,0.28)]`}
                      >
                        {mark}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}