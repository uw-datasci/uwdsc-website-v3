"use client";

import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "@/lib/api";
import { Button } from "@uwdsc/ui/index";
import Link from "next/link";

export default function Home() {
  const { profile, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  const getGreeting = () => {
    if (profile?.first_name) {
      return `Hi ${profile.first_name}!`;
    }
    if (isAuthenticated) {
      return "Hi there!";
    }
    return "Welcome!";
  };

  return (
    <div className="min-h-screen">
      <div className="flex gap-4 justify-center py-16 mt-32">
        <Link href="/register">
          <Button>Register</Button>
        </Link>
        <Link href="/login">
          <Button variant="outline">Login</Button>
        </Link>
        <Button variant="outline" onClick={async () => await signOut()}>
          Signout
        </Button>
      </div>

      <div className="text-center items-center justify-center">
        <h1 className="text-4xl font-bold">{getGreeting()} 👋</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {isAuthenticated
            ? "You're logged in!"
            : "Please log in to get started."}
        </p>
      </div>
    </div>
  );
}
