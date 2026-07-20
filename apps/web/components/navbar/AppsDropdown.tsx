"use client";

import Link from "next/link";
import {
  GlassSurface,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@uwdsc/ui";
import { NavGroup, NavLinkItem } from "./types";

interface AppsDropdownProps {
  readonly group: NavGroup;
}

function AppLink({ item }: { readonly item: NavLinkItem }) {
  return (
    <NavigationMenuLink asChild>
      <Link
        href={item.href}
        target={item.target}
        rel={
          item.target === "_blank" ? "noopener noreferrer" : undefined
        }
        className="flex flex-row items-center gap-3 rounded-md p-3 no-underline outline-none transition-colors hover:bg-muted/75 focus:bg-muted/75"
      >
        {item.icon ? (
          <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
        ) : null}
        <span className="text-sm font-medium leading-normal">{item.label}</span>
      </Link>
    </NavigationMenuLink>
  );
}

function AdminLink({ item }: { readonly item: NavLinkItem }) {
  const Icon = item.icon;

  return (
    <NavigationMenuLink asChild>
      <Link
        href={item.href}
        target={item.target}
        rel={
          item.target === "_blank" ? "noopener noreferrer" : undefined
        }
        className="flex aspect-square w-24 flex-col items-center justify-center gap-2 rounded-md p-3 no-underline outline-none transition-colors hover:bg-muted/75 focus:bg-muted/75"
      >
        {Icon ? <Icon className="h-6 w-6 shrink-0" aria-hidden="true" /> : null}
        <span className="text-sm font-medium leading-normal">{item.label}</span>
      </Link>
    </NavigationMenuLink>
  );
}

function GridIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="h-6 w-6"
      aria-hidden="true"
    >
      {[1.75, 9.5, 17.25].flatMap((y) =>
        [1.75, 9.5, 17.25].map((x) => (
          <rect key={`${x}-${y}`} x={x} y={y} width={5} height={5} rx={1} />
        )),
      )}
    </svg>
  );
}

export function AppsDropdown({ group }: AppsDropdownProps) {
  return (
    <NavigationMenuItem className="relative mr-2 pl-8 before:absolute before:left-0 before:h-10 before:w-px before:bg-white/35">
      <NavigationMenuTrigger
        aria-label={group.label}
        className="h-10 w-10 rounded-full p-0 bg-transparent! hover:bg-transparent! focus:bg-transparent! focus-visible:bg-transparent! data-[state=open]:bg-transparent! hover:text-nav-hover-blue data-[state=open]:text-nav-hover-blue transition-colors"
      >
        <GridIcon />
      </NavigationMenuTrigger>
      <NavigationMenuContent className="bg-transparent! border-0! shadow-none! mt-5! w-max">
        <GlassSurface
          width="100%"
          height="auto"
          borderRadius={12}
          backgroundOpacity={0.5}
          brightness={95}
          className="p-0 min-w-full"
        >
          <div
            className={
              group.adminLink
                ? "flex gap-1 p-2"
                : "p-2"
            }
          >
            {group.adminLink ? (
              <AdminLink item={group.adminLink} />
            ) : null}
            <ul
              className={
                group.adminLink
                  ? "flex min-w-44 flex-1 flex-col gap-1"
                  : "grid w-44 gap-1"
              }
            >
              {group.items.map((item) => (
                <li key={item.href}>
                  <AppLink item={item} />
                </li>
              ))}
            </ul>
          </div>
        </GlassSurface>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
