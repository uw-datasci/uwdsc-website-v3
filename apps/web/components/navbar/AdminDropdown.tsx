import Link from "next/link";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  GlassSurface,
} from "@uwdsc/ui";

interface AdminLink {
  href: string;
  title: string;
  description: string;
  adminOnly?: boolean;
}

const adminLinks: AdminLink[] = [
  {
    href: "/admin/events",
    title: "Manage Events 📅",
    description: "Create & update events",
  },
  {
    href: "/admin/applications",
    title: "Manage Exec Apps 📝",
    description: "Review apps for next term's team",
    adminOnly: true,
  },
];

interface AdminDropdownProps {
  readonly userRole: "admin" | "exec";
}

export function AdminDropdown({ userRole }: AdminDropdownProps) {
  const isAdmin = userRole === "admin";
  const label = userRole === "admin" ? "Admin" : "Exec";

  // Filter links based on user status
  const visibleLinks = adminLinks.filter((link) => !link.adminOnly || isAdmin);

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="text-sm sm:text-base bg-transparent! hover:bg-transparent! hover:text-nav-hover-blue data-[state=open]:bg-transparent! data-[state=open]:text-nav-hover-blue focus:bg-transparent! focus-visible:bg-transparent!">
        {label}
      </NavigationMenuTrigger>
      <NavigationMenuContent className="bg-transparent! border-0! shadow-none! mt-5! min-w-112.5 w-max">
        <GlassSurface
          width="100%"
          height="auto"
          borderRadius={12}
          backgroundOpacity={0.5}
          brightness={95}
          className="p-0 min-w-full"
        >
          <ul className="grid gap-3 p-4 md:w-112.5 md:grid-cols-[.75fr_1fr]">
            <li className="row-span-3">
              <NavigationMenuLink asChild>
                <Link
                  href="/admin/memberships"
                  className="flex h-full w-full select-none flex-col justify-center rounded-md bg-muted/30 hover:bg-muted/50 p-6 no-underline outline-none transition-colors focus:ring-2 focus:ring-ring"
                >
                  <div className="mb-2 text-lg font-medium">Memberships</div>
                  <p className="text-sm leading-tight text-muted-foreground">
                    Manage club members, roles, and permissions for UWDSC.
                  </p>
                </Link>
              </NavigationMenuLink>
            </li>
            {visibleLinks.map((link) => (
              <li
                key={link.href}
                className={visibleLinks.length === 1 ? "row-span-3" : ""}
              >
                <NavigationMenuLink asChild>
                  <Link
                    href={link.href}
                    className={`select-none rounded-md leading-none no-underline outline-none transition-colors hover:bg-muted/30 focus:bg-muted/30 ${
                      visibleLinks.length === 1
                        ? "flex h-full flex-col justify-center p-6 space-y-2"
                        : "block space-y-1 p-3"
                    }`}
                  >
                    <div
                      className={`font-medium leading-none ${visibleLinks.length === 1 ? "text-base" : "text-sm"}`}
                    >
                      {link.title}
                    </div>
                    <p
                      className={`leading-snug text-muted-foreground ${visibleLinks.length === 1 ? "text-sm leading-tight" : "text-sm line-clamp-2"}`}
                    >
                      {link.description}
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
            ))}
          </ul>
        </GlassSurface>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
