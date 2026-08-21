"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getOrCreateVisitorId } from "@/lib/tracking/visitorId";

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    const visitorId = getOrCreateVisitorId();
    if (!visitorId) return;

    let cancelled = false;

    const logPageView = async () => {
      const response = await fetch("/api/analytics/page-view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: pathname,
          visitor_id: visitorId
        })
      });

      if (cancelled || response.ok) return;

      console.error("Failed to log page view:", response.status);
    };

    void logPageView();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return null;
}
