"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  GlassSurface,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@uwdsc/ui";
import { NavGroup } from "./types";

interface EventsDropdownProps {
  readonly group: NavGroup;
}

function EventLink({
  item,
}: {
  readonly item: NavGroup["items"][number];
}) {
  const Icon = item.icon;

  return (
    <NavigationMenuLink asChild>
      <Link
        href={item.href}
        className="flex aspect-square w-24 flex-col items-center justify-center gap-2 rounded-md p-3 no-underline outline-none transition-colors hover:bg-muted/75 focus:bg-muted/75"
      >
        {Icon ? <Icon className="h-6 w-6 shrink-0" aria-hidden="true" /> : null}
        <span className="text-center text-sm font-medium leading-tight">{item.label}</span>
      </Link>
    </NavigationMenuLink>
  );
}

export function EventsDropdown({ group }: EventsDropdownProps) {
  const pathname = usePathname();
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = group.items.some((item) => pathname.startsWith(item.href));

  const isDark =
    mounted && (theme === "dark" || (theme === "system" && systemTheme === "dark"));

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
    <NavigationMenuItem className="relative">
      <NavigationMenuTrigger className="h-auto bg-transparent! px-2 sm:px-3 md:px-4 py-2 text-sm sm:text-base font-medium hover:bg-transparent! hover:text-nav-hover-blue focus:bg-transparent! focus-visible:bg-transparent! data-[state=open]:bg-transparent! data-[state=open]:text-nav-hover-blue transition-colors">
        {group.label}
      </NavigationMenuTrigger>
      {isActive && mounted ? (
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
      ) : null}
      <NavigationMenuContent className="bg-transparent! border-0! shadow-none! mt-5! w-max">
        <GlassSurface
          width="100%"
          height="auto"
          borderRadius={12}
          backgroundOpacity={0.5}
          brightness={95}
          className="p-0 min-w-full"
        >
          <ul className="grid grid-cols-2 gap-1 p-2">
            {group.items.map((item) => (
              <li key={item.href}>
                <EventLink item={item} />
              </li>
            ))}
          </ul>
        </GlassSurface>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
