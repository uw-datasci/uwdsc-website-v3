"use client";

import { useState } from "react";
import { Button } from "@uwdsc/ui";
import { ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/api/auth";

export default function UnauthorizedPage() {
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
            <p className="text-muted-foreground">
              You don&apos;t have permission to access the admin panel.
            </p>
            <p className="text-sm text-muted-foreground">
              Only users with admin or executive roles can access this area.
            </p>
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
