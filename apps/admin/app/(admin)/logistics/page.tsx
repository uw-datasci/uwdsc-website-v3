import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@uwdsc/ui";
import { ChevronRight, ClipboardCheck, ClipboardList, UserCheck } from "lucide-react";

const links = [
  {
    href: "/logistics/onboarding",
    title: "Exec onboarding",
    description: "Submit your profile, headshot, and preferences for the current term.",
    icon: ClipboardList,
  },
  {
    href: "/logistics/returning",
    title: "Returning exec form",
    description: "Let us know if you plan to return next term and share role preferences.",
    icon: UserCheck,
  },
  {
    href: "/logistics/onboarding-review",
    title: "Onboarding review",
    description: "Presidents and VPs: review team submissions and export headshots.",
    icon: ClipboardCheck,
  },
] as const;

export default function LogisticsPage() {
  return (
    <div className="mx-auto mt-8 flex w-full max-w-3xl flex-col gap-6 px-4 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Logistics</h1>
        <p className="mt-2 text-muted-foreground">
          Term logistics, onboarding, and returning-exec workflows. Pick a page below to
          continue.
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {links.map(({ href, title, description, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className="block rounded-lg outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Card className="transition-colors hover:bg-muted/40">
                <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-md border bg-background/50 text-muted-foreground">
                    <Icon className="size-5" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {title}
                      <ChevronRight
                        className="size-4 shrink-0 text-muted-foreground"
                        aria-hidden
                      />
                    </CardTitle>
                    <CardDescription className="text-pretty">{description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
