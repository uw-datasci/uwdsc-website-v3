import Link from "next/link";
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
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
    description: "Create and update upcoming club events",
  },
  {
    href: "/admin/applications",
    title: "Manage Exec Apps 📝",
    description: "Review applications for the next term's exec team",
    adminOnly: true,
  },
];

interface AdminDropdownProps {
  readonly userStatus: "admin" | "exec";
}

export function AdminDropdown({ userStatus }: AdminDropdownProps) {
  const isAdmin = userStatus === "admin";
  const label = userStatus === "admin" ? "Admin" : "Exec";

  // Filter links based on user status
  const visibleLinks = adminLinks.filter((link) => !link.adminOnly || isAdmin);

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="text-sm sm:text-base !bg-transparent hover:!bg-transparent hover:text-primary data-[state=open]:!bg-transparent data-[state=open]:text-primary focus:!bg-transparent focus-visible:!bg-transparent">
        {label}
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
          <ul className="grid gap-3 p-4 md:w-[500px] md:grid-cols-[.75fr_1fr]">
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
