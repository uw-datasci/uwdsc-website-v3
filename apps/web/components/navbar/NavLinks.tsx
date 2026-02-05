"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { NavigationMenuItem } from "@uwdsc/ui";

interface NavLink {
  href: string;
  label: string;
}

interface NavLinksProps {
  readonly navLinks: NavLink[];
}

export function NavLinks({ navLinks }: NavLinksProps) {
  const pathname = usePathname();
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";

    return pathname.startsWith(href);
  };

  const isDark =
    mounted &&
    (theme === "dark" || (theme === "system" && systemTheme === "dark"));

  const glassStyles = isDark
    ? {
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px) saturate(1.8) brightness(1.3)",
        WebkitBackdropFilter: "blur(10px) saturate(1.8) brightness(1.3)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: `
          inset 0 1px 0 0 rgba(255, 255, 255, 0.25),
          inset 0 -1px 0 0 rgba(255, 255, 255, 0.1),
          0 4px 12px 0 rgba(0, 0, 0, 0.3)
        `,
      }
    : {
        background: "rgba(255, 255, 255, 0.35)",
        backdropFilter: "blur(10px) saturate(1.5) brightness(1.15)",
        WebkitBackdropFilter: "blur(10px) saturate(1.5) brightness(1.15)",
        border: "1px solid rgba(255, 255, 255, 0.4)",
        boxShadow: `
          inset 0 1px 0 0 rgba(255, 255, 255, 0.5),
          inset 0 -1px 0 0 rgba(255, 255, 255, 0.2),
          0 2px 8px 0 rgba(0, 0, 0, 0.08)
        `,
      };

  return (
    <>
      {navLinks.map((link) => (
        <NavigationMenuItem key={link.href} className="relative">
          <Link
            href={link.href}
            className="inline-flex items-center justify-center px-2 sm:px-3 md:px-4 py-2 text-sm sm:text-base font-medium transition-colors hover:text-nav-hover-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative z-10 text-nowrap"
          >
            {link.label}
          </Link>
          {isActive(link.href) && mounted && (
            <motion.div
              layoutId="glass-indicator"
              className="absolute inset-0 rounded-full"
              style={glassStyles}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                mass: 1.2,
              }}
              initial={false}
            />
          )}
        </NavigationMenuItem>
      ))}
    </>
  );
}
