"use client";

import { NavLinks } from "./navbar/NavLinks";
import { AdminDropdown } from "./navbar/AdminDropdown";
import { UserAvatar } from "./navbar/UserAvatar";
import { MobileMenu } from "./navbar/MobileMenu";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { GlassSurface, NavigationMenu, NavigationMenuList } from "@uwdsc/ui";

export function Navbar() {
  const pathname = usePathname();
  const { profile } = useAuth();

  const hideNavbar = pathname === "/login" || pathname === "/register";

  // Navigation links
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/team", label: "Team" },
    { href: "/apply", label: "Apply" },
    { href: "/calendar", label: "Calendar" },
  ];

  // Check if user is admin or exec
  const userRole = profile?.user_role || undefined;
  const isAdminOrExec = userRole === "admin" || userRole === "exec";
  const isAdmin = userRole === "admin";
  const adminLabel = userRole === "admin" ? "Admin" : "Exec";

  const visibleAdminLinks = [
    {
      href: "/admin/memberships",
      title: "Memberships",
    },
    {
      href: "/admin/events",
      title: "Events",
    },
    {
      href: "/admin/applications",
      title: "Exec Apps",
      adminOnly: true,
    },
  ].filter((link) => !link.adminOnly || isAdmin);

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
                {isAdminOrExec && (
                  <AdminDropdown userRole={userRole as "admin" | "exec"} />
                )}
                <UserAvatar />
              </NavigationMenuList>
            </NavigationMenu>
          </GlassSurface>
        </div>

        {/* Mobile Menu */}
        <MobileMenu
          navLinks={navLinks}
          profile={profile}
          isAdminOrExec={isAdminOrExec}
          adminLabel={adminLabel}
          visibleAdminLinks={visibleAdminLinks}
        />
      </div>
    </div>
  );
}
