import type { ReactNode } from "react";
import { Badge, Card, CardContent, Skeleton } from "@uwdsc/ui";
import { QrCode } from "lucide-react";

interface PassportHeaderProps {
  readonly initials: string;
  readonly displayName: string;
  readonly email: string | null | undefined;
  readonly membershipLoading: boolean;
  readonly isMember: boolean;
  /** Exec title from exec_team (e.g. position name); omit or null to hide. */
  readonly execPositionLabel?: string | null;
}

export function PassportHeader({
  initials,
  displayName,
  email,
  membershipLoading,
  isMember,
  execPositionLabel,
}: PassportHeaderProps) {
  let membershipBadge: ReactNode;

  if (membershipLoading) {
    membershipBadge = <Skeleton className="h-6 w-24 rounded-full" />;
  } else if (isMember) {
    membershipBadge = (
      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 rounded-full px-3 shadow-[0_0_14px_rgba(16,185,129,0.25)]">
        Active Member
      </Badge>
    );
  } else {
    membershipBadge = (
      <Badge
        variant="outline"
        className="bg-red-500/10 text-red-400 border-red-500/40 rounded-full px-3"
      >
        Not Paid
      </Badge>
    );
  }

  return (
    <Card className="overflow-hidden rounded-2xl border border-white/15 bg-[#121212] text-white shadow-2xl">
      <CardContent className="space-y-4 p-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-[#3f5a73] via-[#2f4a61] to-[#13263b] p-3">
            <div className="flex h-28 items-center justify-center rounded-lg border border-white/20 bg-black/20 text-3xl font-bold text-white/90">
              {initials}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white p-3">
            <div className="grid h-28 grid-cols-6 grid-rows-6 gap-1">
              {Array.from({ length: 36 }).map((_, index) => (
                <div
                  key={index}
                  className={
                    (index + (index % 2 === 0 ? 1 : 0)) % 3 === 0
                      ? "rounded-[2px] bg-black"
                      : "rounded-[2px] bg-white"
                  }
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/25 px-3 py-2">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/85">
            <QrCode className="size-3.5" />
            My Passport
          </div>
          <div className="truncate text-xs text-white/60">DSC Passport</div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-white/10 bg-black/35 px-3 py-2">
            <p className="text-[10px] uppercase tracking-[0.15em] text-white/55">Member</p>
            <p className="truncate text-sm font-semibold text-white/95">{displayName}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/35 px-3 py-2">
            <p className="text-[10px] uppercase tracking-[0.15em] text-white/55">Status</p>
            <div className="mt-1">{membershipBadge}</div>
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-black/35 px-3 py-2">
          <p className="text-[10px] uppercase tracking-[0.15em] text-white/55">Email</p>
          <p className="truncate text-xs text-white/80">{email}</p>
        </div>

        {execPositionLabel ? (
          <Badge
            className="w-fit max-w-full truncate rounded-full border border-fuchsia-300/45 bg-fuchsia-400/20 px-3 text-xs text-fuchsia-100"
            title={execPositionLabel}
          >
            {execPositionLabel}
          </Badge>
        ) : null}
      </CardContent>
    </Card>
  );
}
