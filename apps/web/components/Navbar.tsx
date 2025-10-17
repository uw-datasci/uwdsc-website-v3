"use client";

import { NavigationMenu, NavigationMenuList, GlassSurface } from "@uwdsc/ui";
import { NavLinks } from "./navbar/NavLinks";
import { AdminDropdown } from "./navbar/AdminDropdown";
import { UserAvatar } from "./navbar/UserAvatar";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

  const hideNavbar = pathname === "/login" || pathname === "/register";

  if (hideNavbar) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit px-2 sm:px-4">
      <GlassSurface
        width="100%"
        height="auto"
        borderRadius={9999}
        className="px-4 sm:px-8 md:px-12 py-2 sm:py-3 !overflow-visible"
      >
        <NavigationMenu viewport={false}>
          <NavigationMenuList className="gap-2 sm:gap-4 md:gap-8">
            <NavLinks />
            <AdminDropdown />
            <UserAvatar />
          </NavigationMenuList>
        </NavigationMenu>
      </GlassSurface>
    </div>
  );
}
