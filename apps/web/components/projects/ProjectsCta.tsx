"use client";

import Link from "next/link";
import { Button } from "@uwdsc/ui";
import { useAuth } from "@/contexts/AuthContext";
import { useApplyWindow } from "@/hooks/useApplyWindow";

export function ProjectsCta() {
  const { user } = useAuth();
  const { open: applyOpen } = useApplyWindow();

  // Applying needs a session (its term lookup 401s), so signed-out visitors
  // register first — same fallback the Hero CTA uses.
  const joinHref = user ? "/apply" : "/register";

  return (
    <div className="mt-20 flex flex-col items-center gap-4 text-center">
      <p className="text-grey2">Want to build something like this with us?</p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        {applyOpen ? (
          <Button
            asChild
            size="lg"
            className="bg-gradient-purple rounded-full px-6 py-6 text-sm font-bold text-white transition-transform hover:scale-105"
          >
            <Link href={joinHref}>Join our team →</Link>
          </Button>
        ) : null}
        <div className="rounded-full bg-linear-to-tr from-pink-500 to-indigo-700 p-px">
          <Button asChild variant="ghost" size="lg" className="bg-background px-6 py-6 text-sm">
            <Link href="/#contact">Get involved →</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
