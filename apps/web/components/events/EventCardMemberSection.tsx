"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@uwdsc/ui";

export function EventCardMemberSection() {
  const { user } = useAuth();
  const profile = user;

  const displayName =
    profile?.first_name != null || profile?.last_name != null
      ? [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
        "—"
      : "—";

  const mathSocBadgeClassName = profile?.is_math_soc_member
    ? "bg-amber-500/20 text-amber-300 border-amber-500/50 text-xs px-2 py-1 rounded-full font-semibold"
    : "bg-white/10 text-white/60 border-white/20 text-xs px-2 py-1 rounded-full font-medium";

  return (
    <div className="rounded-lg sm:rounded-xl border border-white/10 bg-white/10 backdrop-blur-md p-3 sm:p-4 shadow-lg shadow-black/10 min-w-0">
      <p className="text-[10px] sm:text-xs text-white/50 uppercase tracking-[0.2em] mb-2 sm:mb-3 font-semibold">
        {profile?.role ?? "member"}
      </p>
      <p className="text-white font-medium truncate text-sm sm:text-base">{displayName}</p>
      <p className="text-white/80 text-xs sm:text-sm mt-1.5 sm:mt-2 font-mono truncate">
        {profile?.wat_iam ?? "—"}
      </p>
      <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-4">
        {profile?.faculty != null && (
          <Badge
            variant="outline"
            className="bg-white/10 text-white/90 border-white/30 text-xs px-2.5 py-0.5 rounded-full font-semibold capitalize"
          >
            {profile.faculty}
          </Badge>
        )}
        {profile != null && (
          <Badge variant="outline" className={mathSocBadgeClassName}>
            {profile.is_math_soc_member ? "MathSoc member" : "Not MathSoc"}
          </Badge>
        )}
      </div>
    </div>
  );
}
