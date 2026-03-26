"use client";

import Link from "next/link";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@uwdsc/ui";
import { useAuth } from "@/contexts/AuthContext";

export default function PassportShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated } = useAuth();

  return (
    <main className="flex min-h-[60vh] items-start justify-center px-4 pb-10 pt-28 lg:pt-32">
      <Card className="w-full max-w-3xl">
        {isAuthenticated ? (
          <>
            <CardHeader>
              <CardTitle>My Passport</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <section className="space-y-2">
                <h2 className="text-sm font-medium">Member Info</h2>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="rounded-md border p-3 text-sm text-muted-foreground">
                    Name: Placeholder Member
                  </div>
                  <div className="rounded-md border p-3 text-sm text-muted-foreground">
                    Member Since: Fall 2026
                  </div>
                  <div className="rounded-md border p-3 text-sm text-muted-foreground">
                    Passport Level: Explorer
                  </div>
                  <div className="rounded-md border p-3 text-sm text-muted-foreground">
                    Next Milestone: 3 more stamps
                  </div>
                </div>
              </section>

              <section className="space-y-2">
                <h2 className="text-sm font-medium">Progress</h2>
                <div className="grid gap-2 sm:grid-cols-3">
                  <div className="rounded-md border p-3 text-center">
                    <p className="text-xl font-semibold">0</p>
                    <p className="text-xs text-muted-foreground">Stamps</p>
                  </div>
                  <div className="rounded-md border p-3 text-center">
                    <p className="text-xl font-semibold">0</p>
                    <p className="text-xs text-muted-foreground">Achievements</p>
                  </div>
                  <div className="rounded-md border p-3 text-center">
                    <p className="text-xl font-semibold">0</p>
                    <p className="text-xs text-muted-foreground">Challenges</p>
                  </div>
                </div>
              </section>

              {children}
            </CardContent>
          </>
        ) : (
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <p className="text-muted-foreground">Log in to see your passport!</p>
              <Link href="/login">
                <Button>Log In</Button>
              </Link>
            </div>
          </CardContent>
        )}
      </Card>
    </main>
  );
}