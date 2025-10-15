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
  },
];

export function AdminDropdown() {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="text-sm sm:text-base !bg-transparent hover:!bg-transparent hover:text-primary data-[state=open]:!bg-transparent data-[state=open]:text-primary focus:!bg-transparent focus-visible:!bg-transparent">
        Admin
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
            {adminLinks.map((link) => (
              <li key={link.href}>
                <NavigationMenuLink asChild>
                  <Link
                    href={link.href}
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted/30 focus:bg-muted/30"
                  >
                    <div className="text-sm font-medium leading-none">
                      {link.title}
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
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
