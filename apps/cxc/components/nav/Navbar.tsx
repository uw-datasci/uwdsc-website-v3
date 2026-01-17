"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { MobileMenu } from "./MobileMenu";
import UserAvatar from "./UserAvatar";
import {
  ArrowRightIcon,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@uwdsc/ui";
import { cn } from "@uwdsc/ui/lib/utils";
import CxCButton from "../CxCButton";
import DSCLogo from "../DSCLogo";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
];

const adminPages = [
  {
    href: "/admin/applications",
    label: "Applications",
    description: "View and manage all submitted applications",
  },
  {
    href: "/admin/review",
    label: "Review",
    description: "Review applications one at a time",
  },
  {
    href: "/admin/assign-volunteers",
    label: "Assign Roles",
    description: "Search for users and assign hacker or volunteer roles",
  },
];

const superadminPages = [
  {
    href: "/admin/assign",
    label: "Assign Roles",
    description: "Search for users and assign admin roles",
  },
  {
    href: "/admin/leaderboard",
    label: "Leaderboard",
    description: "View review statistics and leaderboard",
  },
];

export default function Navbar() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const pathname = usePathname();
  const showAuthButtons =
    process.env.NODE_ENV === "development" || pathname !== "/start";

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show navbar when at the top
      if (currentScrollY < 10) {
        setIsVisible(true);
      }
      // Hide navbar when scrolling down
      else if (currentScrollY > lastScrollY && currentScrollY > 10) {
        setIsVisible(false);
      }
      // Show navbar when scrolling up
      else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    // Hide navbar on dashboard routes
    pathname?.startsWith("/dashboard") ? null : (
      <motion.nav
        className="w-full fixed top-0 left-0 right-0 bg-background z-50 cxc-app-font"
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : "-100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* MLH Trust Badge - Only show on home page */}
        {pathname === "/" && (
          <a
            id="mlh-trust-badge"
            className={`${isLoading ? "hidden" : " "} absolute top-0 left-20 sm:left-auto  ${isAuthenticated ? "sm:right-20 md:right-24 lg:right-28" : "sm:right-68 md:right-78"} w-16 md:w-20 lg:w-22 z-10`}
            href="https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2026-season&utm_content=white"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="https://s3.amazonaws.com/logged-assets/trust-badge/2026/mlh-trust-badge-2026-white.svg"
              alt="Major League Hacking 2026 Hackathon Season"
              width={96}
              height={96}
              className="w-full h-auto"
            />
          </a>
        )}

        <div className="w-full py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 w-full items-center justify-between">
            {/* Left section - Logo and Navigation */}
            <div className="flex items-center gap-12">
              {/* Logo */}
              <DSCLogo size={12} href="/" />

              {/* Navigation Links - only show to authenticated users */}
              {!isLoading && isAuthenticated && (
                <NavigationMenu className="hidden sm:flex">
                  <NavigationMenuList>
                    {navLinks.map((link) => (
                      <NavigationMenuItem key={link.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={link.href}
                            className={cn(
                              "inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 !text-base font-medium",
                              "transition-colors hover:text-gray-400 focus:text-gray-400 outline-none",
                              "hover:bg-transparent focus:bg-transparent bg-transparent",
                            )}
                          >
                            {link.label}
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    ))}

                    {/* Admin dropdown - only show to admin or superadmin users */}
                    {(user?.role === "admin" ||
                      user?.role === "superadmin") && (
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className="!text-base font-medium">
                          Admin
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                            {adminPages.map((page) => (
                              <li key={page.href}>
                                <NavigationMenuLink asChild>
                                  <Link
                                    href={page.href}
                                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                  >
                                    <div className="text-sm font-medium leading-none">
                                      {page.label}
                                    </div>
                                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                      {page.description}
                                    </p>
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    )}

                    {/* Superadmin dropdown - only show to superadmin users */}
                    {user?.role === "superadmin" && (
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className="!text-base font-medium">
                          Superadmin
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                            {superadminPages.map((page) => (
                              <li key={page.href}>
                                <NavigationMenuLink asChild>
                                  <Link
                                    href={page.href}
                                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                  >
                                    <div className="text-sm font-medium leading-none">
                                      {page.label}
                                    </div>
                                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                      {page.description}
                                    </p>
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    )}
                  </NavigationMenuList>
                </NavigationMenu>
              )}
            </div>

            {/* Right section - Auth Buttons (includes mobile menu on small screens) */}
            {showAuthButtons && !isLoading && (
              <div className="flex items-center gap-4">
                {isAuthenticated ? (
                  <>
                    <div className="hidden sm:block">
                      <UserAvatar />
                    </div>
                    <div className="block sm:hidden flex items-center justify-center">
                      <MobileMenu
                        navLinks={navLinks}
                        user={user ?? null}
                        adminPages={adminPages}
                        superadminPages={superadminPages}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-wrap gap-4 md:gap-8 font-normal">
                    <CxCButton
                      asChild
                      className="group text-sm md:text-base inline-flex items-center lg:px-4"
                    >
                      <Link href="/login">
                        <span>Login</span>
                        <motion.div
                          className="group-hover:translate-x-1.5 duration-200"
                          transition={{
                            ease: "easeInOut",
                          }}
                        >
                          <ArrowRightIcon weight="bold" />
                        </motion.div>
                      </Link>
                    </CxCButton>
                    <CxCButton
                      asChild
                      className="group text-sm md:text-base inline-flex items-center lg:px-4"
                    >
                      <Link href="/register">
                        <span>Register</span>
                        <motion.div
                          className="group-hover:translate-x-1.5 duration-200"
                          transition={{
                            ease: "easeInOut",
                          }}
                        >
                          <ArrowRightIcon weight="bold" />
                        </motion.div>
                      </Link>
                    </CxCButton>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.nav>
    )
  );
}
