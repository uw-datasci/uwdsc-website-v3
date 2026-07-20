"use client";

import { NavLinks } from "./navbar/NavLinks";
import { AppsDropdown } from "./navbar/AppsDropdown";
import { NavGroup, NavLinkItem } from "./navbar/types";
import { UserAvatar } from "./navbar/UserAvatar";
import { MobileMenu } from "./navbar/MobileMenu";
import { WrappedModal } from "./wrapped/WrappedModal";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getApplyWindowOpen } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { ADMIN_ROLES } from "@uwdsc/common/constants";
import {
  GlassSurface,
  NavigationMenu,
  NavigationMenuList,
  Button,
  NavigationMenuItem,
} from "@uwdsc/ui";
import { Calculator, Heart, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";

const hideNavbarPaths = new Set(["/login", "/register", "/complete-profile"]);

export function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [applyInNav, setApplyInNav] = useState(false);
  const [wrappedOpen, setWrappedOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getApplyWindowOpen();
        if (!cancelled) setApplyInNav(Boolean(data.open));
      } catch {
        /* keep hidden */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const hideNavbar = hideNavbarPaths.has(pathname);

  // Navigation links
  const navLinks: NavLinkItem[] = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Check-in" },
    { href: "/team", label: "Team" },
    ...(applyInNav ? [{ href: "/apply", label: "Apply" }] : []),
    { href: "/calendar", label: "Calendar" },
  ];

  const isAdmin = Boolean(user?.role && ADMIN_ROLES.has(user.role));
  const adminUrl =
    process.env.NEXT_PUBLIC_ADMIN_URL || "https://admin.uwdatascience.ca/";

  // External UWDSC applications, shown in the apps launcher dropdown
  const appsGroup: NavGroup = {
    label: "Apps",
    ...(isAdmin
      ? {
          adminLink: {
            href: adminUrl,
            label: "Admin",
            icon: LayoutDashboard,
            target: "_blank",
          },
        }
      : {}),
    items: [
      {
        href: "https://speed-dataing.uwdatascience.ca",
        label: "Speed Dataing",
        icon: Heart,
        target: "_blank",
      },
      {
        href: "https://estimathon.uwdatascience.ca",
        label: "Estimathon",
        icon: Calculator,
        target: "_blank",
      },
    ],
  };

  if (hideNavbar) return null;

  return (
    <div className="fixed left-0 right-0 z-50 px-6 py-6 lg:px-12 lg:py-8">
      <div className="relative flex items-center justify-between mx-auto">
        {/* DSC Logo */}
        <Link href="/" className="relative w-12 h-12 lg:w-14 lg:h-14 hover:cursor-pointer">
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
                {process.env.NODE_ENV !== "production" && (
                  <NavigationMenuItem>
                    <Button
                      variant="ghost"
                      onClick={() => setWrappedOpen(true)}
                      className="h-10 flex flex-row items-center gap-2 px-4 rounded-md hover:bg-transparent dark:hover:bg-transparent hover:text-nav-hover-blue"
                    >
                      <span className="text-sm font-medium">Wrapped</span>
                    </Button>
                  </NavigationMenuItem>
                )}
                <AppsDropdown group={appsGroup} />
                <UserAvatar />
              </NavigationMenuList>
            </NavigationMenu>
          </GlassSurface>
        </div>

        {/* Mobile Menu */}
        <MobileMenu
          navLinks={[...navLinks, appsGroup]}
          user={user}
          onOpenWrapped={() => setWrappedOpen(true)}
        />
      </div>
      <WrappedModal open={wrappedOpen} onOpenChange={setWrappedOpen} />
    </div>
  );
}
