"use client";

import { Suspense } from "react";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh items-center justify-center p-4">
          <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 shadow-lg">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Admin Login</h1>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
