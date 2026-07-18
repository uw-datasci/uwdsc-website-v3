"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { createSupabaseBrowserClient } from "@uwdsc/db";
import { getOrCreateVisitorId } from "@/lib/tracking/visitorId";

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    const visitorId = getOrCreateVisitorId();
    if (!visitorId) return;

    let cancelled = false;

    const logPageView = async () => {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.rpc("log_page_view", {
        p_path: pathname,
        p_visitor_id: visitorId,
      });

      if (cancelled || !error) return;

      console.error("Failed to log page view:", error);
    };

    void logPageView();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return null;
}
