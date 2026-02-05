"use client";

import { User, LogOut, LogIn } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  Button,
  GlassSurface,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@uwdsc/ui";

export function UserAvatar() {
  const { profile, isLoading, isAuthenticated, mutate } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      // Revalidate the auth state
      await mutate();
      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  // Show loading state
  if (isLoading) {
    return null;
  }

  // Show login button if not authenticated
  if (!isAuthenticated) {
    return (
      <NavigationMenuItem className="relative pl-8 before:absolute before:left-0 before:h-10 before:w-px before:bg-border">
        <Link href="/login">
          <Button
            variant="ghost"
            className="h-10 flex flex-row items-center gap-2 px-4 rounded-md hover:text-nav-hover-blue"
          >
            <LogIn className="h-4 w-4" />
            <span className="text-sm font-medium">Log In</span>
          </Button>
        </Link>
      </NavigationMenuItem>
    );
  }

  const initials =
    profile?.first_name && profile?.last_name
      ? `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase()
      : "??";

  const fullName =
    profile?.first_name && profile?.last_name
      ? `${profile.first_name} ${profile.last_name}`
      : "User";

  return (
    <NavigationMenuItem className="relative pl-8 before:absolute before:left-0 before:h-10 before:w-px before:bg-white/35">
      <NavigationMenuTrigger className="h-10 w-10 rounded-full p-0 bg-transparent! hover:bg-transparent! focus:bg-transparent! focus-visible:bg-transparent! data-[state=open]:bg-transparent! hover:scale-105 transition-transform">
        <Avatar className="h-9 w-9">
          <AvatarImage src={undefined} alt={fullName} />
          <AvatarFallback className="bg-nav-hover-blue text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
      </NavigationMenuTrigger>
      <NavigationMenuContent className="bg-transparent! border-0! shadow-none! mt-5! min-w-48 w-max">
        <GlassSurface
          width="100%"
          height="auto"
          borderRadius={12}
          backgroundOpacity={0.5}
          brightness={95}
          className="p-0 min-w-full"
        >
          <ul className="grid w-48 gap-1 p-2">
            <li className="px-3 py-2 border-b border-border/50">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{fullName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {profile?.email}
                </p>
              </div>
            </li>
            <li>
              <NavigationMenuLink asChild>
                <Link
                  href="/passport"
                  className="flex flex-row items-center gap-3 rounded-md p-3 no-underline outline-none transition-colors hover:bg-muted/75 focus:bg-muted/75"
                >
                  <User className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-medium leading-normal">
                    My Passport
                  </span>
                </Link>
              </NavigationMenuLink>
            </li>

            <li className="border-t border-white/30 pt-1">
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="w-full h-auto flex flex-row items-center justify-start gap-3 p-3 hover:bg-muted/75! hover:text-destructive focus:bg-muted/75 focus:text-destructive rounded-md"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span className="text-sm font-medium leading-normal">
                  Log out
                </span>
              </Button>
            </li>
          </ul>
        </GlassSurface>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
