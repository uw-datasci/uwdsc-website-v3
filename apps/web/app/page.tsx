"use client";

import { useAuth } from "@/contexts/AuthContext";

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
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
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
