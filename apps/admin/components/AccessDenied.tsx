"use client";

import { signOut } from "@/lib/api/auth";
import { Button } from "@uwdsc/ui";
import {
  MEMBERSHIP_INBOUND_EMAIL,
  MEMBERSHIP_MONERIS_RECEIPT_FROM,
  MEMBERSHIP_PAYMENT_URL,
} from "@uwdsc/common/constants";
import { ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AccessDeniedProps {
  readonly execUnpaid?: boolean;
}

export function AccessDenied({ execUnpaid }: AccessDeniedProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } finally {
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 shadow-lg">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <ShieldAlert className="h-12 w-12 text-destructive" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Access Denied</h1>
            {execUnpaid ? (
              <>
                <p className="text-muted-foreground">You have not paid your membership.</p>
                <p className="text-sm text-muted-foreground">
                  Pay your membership to access the admin site.
                </p>
                <ol className="mt-4 max-w-sm list-decimal space-y-2 pl-5 text-left text-sm text-muted-foreground">
                  <li>
                    Pay the $4 fee online:{" "}
                    <a
                      href={MEMBERSHIP_PAYMENT_URL}
                      className="font-medium text-foreground underline underline-offset-2 hover:text-primary"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      membership payment page
                    </a>{" "}
                    (WUSA Shop → Memberships → DSC).
                  </li>
                  <li>
                    If you used WUSA online, forward the Moneris payment receipt (from{" "}
                    <span className="font-mono text-xs font-bold text-foreground break-all">
                      {MEMBERSHIP_MONERIS_RECEIPT_FROM}
                    </span>
                    , not the generic WUSA order email) to{" "}
                    <span className="font-mono text-xs font-bold text-foreground break-all">
                      {MEMBERSHIP_INBOUND_EMAIL}
                    </span>{" "}
                    from the same address as your club account.
                  </li>
                  <li>
                    Or pay cash at DSC office/events, or by card at the MathSoc office (keep
                    your receipt).
                  </li>
                </ol>
              </>
            ) : (
              <>
                <p className="text-muted-foreground">
                  You don&apos;t have permission to access the admin panel.
                </p>
                <p className="text-sm text-muted-foreground">
                  Only users with admin or executive roles can access this area.
                </p>
              </>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={() => router.back()} variant="outline">
              Go Back
            </Button>
            <Button onClick={handleSignOut} disabled={isSigningOut}>
              {isSigningOut ? "Signing out..." : "Return to Login"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
