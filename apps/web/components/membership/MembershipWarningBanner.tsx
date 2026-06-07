"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getMembershipStatus } from "@/lib/api/profile";
import type { MembershipStatus } from "@uwdsc/common/types";
import { toast } from "sonner";
import { MEMBERSHIP_PAYMENT_URL } from "@uwdsc/common/constants";

const HIDE_ON_PATHS = new Set(["/login", "/register", "/complete-profile", "/events"]);

export function MembershipWarningBanner() {
  const { user, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const [membershipStatus, setMembershipStatus] = useState<MembershipStatus | null>(null);
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
    const shouldShow =
      !isAuthenticated ||
      !user ||
      !membershipStatus ||
      !isOpen ||
      HIDE_ON_PATHS.has(pathname) ||
      membershipStatus.has_membership;

    if (shouldShow) return;

    toast.warning("Membership incomplete", {
      description: (
        <div className="flex flex-col gap-2">
          <p>Please pay the DSC membership fee to access all member benefits.</p>
          <p>
            <a
              href={MEMBERSHIP_PAYMENT_URL}
              className="font-semibold underline underline-offset-2 transition-colors hover:text-blue-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              Pay DSC membership
            </a>
          </p>
        </div>
      ),
      duration: 10000,
      icon: <AlertTriangle className="h-4 w-4" aria-hidden />,
    });

    setIsOpen(false);
  }, [isAuthenticated, user, membershipStatus, pathname, isOpen]);

  return null;
}
