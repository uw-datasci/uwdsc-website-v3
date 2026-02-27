"use client";

import { NavLinks } from "./navbar/NavLinks";
import { UserAvatar } from "./navbar/UserAvatar";
import { MobileMenu } from "./navbar/MobileMenu";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { GlassSurface, NavigationMenu, NavigationMenuList } from "@uwdsc/ui";

const hideNavbarPaths = new Set(["/login", "/register", "/complete-profile"]);

export function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const hideNavbar = hideNavbarPaths.has(pathname);

  // Navigation links
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Check-in" },
    { href: "/team", label: "Team" },
    { href: "/apply", label: "Apply" },
    { href: "/calendar", label: "Calendar" },
    // Add Admin link if user is an admin
    ...(user?.role === "admin"
      ? [
          {
            href:
              process.env.NEXT_PUBLIC_ADMIN_URL ||
              "https://admin.uwdatascience.ca/",
            label: "Admin",
            target: "_blank",
          },
        ]
      : []),
  ];

  if (hideNavbar) return null;

  return (
    <div className="fixed left-0 right-0 z-50 px-6 py-6 lg:px-12 lg:py-8">
      <div className="relative flex items-center justify-between mx-auto">
        {/* DSC Logo */}
        <Link
          href="/"
          className="relative w-12 h-12 lg:w-14 lg:h-14 hover:cursor-pointer"
        >
          <Image
            src="/logos/dsc.svg"
            alt="uwdsc logo"
            fill
            className="object-contain"
            priority
          />
        </Link>

        {/* Centered Desktop Navbar */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <GlassSurface
            width="100%"
            height="auto"
            borderRadius={9999}
            className="hidden lg:block px-8 py-2 overflow-visible!"
          >
            <NavigationMenu viewport={false}>
              <NavigationMenuList className="gap-4">
                <NavLinks navLinks={navLinks} />
                <UserAvatar />
              </NavigationMenuList>
            </NavigationMenu>
          </GlassSurface>
        </div>

        {/* Mobile Menu */}
        <MobileMenu navLinks={navLinks} user={user} />
      </div>
    </div>
  );
}
