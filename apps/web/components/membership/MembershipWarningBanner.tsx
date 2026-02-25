"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getMembershipStatus } from "@/lib/api/profile";
import type { MembershipStatus } from "@uwdsc/common/types";
import { toast } from "sonner";

const HIDE_ON_PATHS = new Set(["/login", "/register", "/complete-profile"]);

export function MembershipWarningBanner() {
  const { user, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const [membershipStatus, setMembershipStatus] =
    useState<MembershipStatus | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setMembershipStatus(null);
      return;
    }

    if (HIDE_ON_PATHS.has(pathname)) return;

    let cancelled = false;

    getMembershipStatus()
      .then((status) => {
        if (cancelled) return;
        setMembershipStatus(status);
        setIsOpen(true);
      })
      .catch((error) => {
        console.error("Failed to fetch membership status for banner:", error);
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user, pathname]);

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    if (!membershipStatus) return;
    if (!isOpen) return;
    if (HIDE_ON_PATHS.has(pathname)) return;

    const hasMembership = membershipStatus.has_membership;
    const isMathSocMember = user.is_math_soc_member;

    if (hasMembership && isMathSocMember) return;

    const messages: string[] = [];
    if (!hasMembership) messages.push("pay the DSC membership fee");
    if (!isMathSocMember) messages.push("make sure you're a MathSoc member");
    const description = messages.join(" and ");

    toast.warning("Membership incomplete", {
      description: `Please ${description} to access all member benefits.`,
      duration: Infinity,
      icon: <AlertTriangle className="h-4 w-4" aria-hidden />,
    });

    setIsOpen(false);
  }, [isAuthenticated, user, membershipStatus, pathname, isOpen]);

  return null;
}
