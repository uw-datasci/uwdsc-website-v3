"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  GlassSurface,
} from "@uwdsc/ui";
import { User, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export function UserAvatar() {
  const { profile, isLoading, isAuthenticated } = useAuth();

  // Don't show avatar if not authenticated or still loading
  if (!isAuthenticated || isLoading) {
    return null;
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
    <NavigationMenuItem className="relative pl-8 before:absolute before:left-0 before:h-10 before:w-px before:bg-border">
      <NavigationMenuTrigger className="h-10 w-10 rounded-full p-0 !bg-transparent hover:!bg-transparent focus:!bg-transparent focus-visible:!bg-transparent data-[state=open]:!bg-transparent hover:scale-105 transition-transform">
        <Avatar className="h-9 w-9">
          <AvatarImage src={undefined} alt={fullName} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
      </NavigationMenuTrigger>
      <NavigationMenuContent className="!bg-transparent !border-0 !shadow-none">
        <GlassSurface
          width="100%"
          height="auto"
          borderRadius={12}
          backgroundOpacity={0.5}
          brightness={95}
          className="p-0"
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
                  href="/profile"
                  className="flex flex-row items-center gap-3 rounded-md p-3 no-underline outline-none transition-colors hover:bg-muted/30 focus:bg-muted/30"
                >
                  <User className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-medium leading-normal">
                    Profile
                  </span>
                </Link>
              </NavigationMenuLink>
            </li>

            <li>
              <NavigationMenuLink asChild>
                <Link
                  href="/settings"
                  className="flex flex-row items-center gap-3 rounded-md p-3 no-underline outline-none transition-colors hover:bg-muted/30 focus:bg-muted/30"
                >
                  <Settings className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-medium leading-normal">
                    Settings
                  </span>
                </Link>
              </NavigationMenuLink>
            </li>
            <li className="border-t border-border/50 pt-1">
              <NavigationMenuLink asChild>
                <Button
                  variant="ghost"
                  className="w-full h-auto flex flex-row items-center justify-start gap-3 p-3 hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-medium leading-normal">
                    Log out
                  </span>
                </Button>
              </NavigationMenuLink>
            </li>
          </ul>
        </GlassSurface>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
