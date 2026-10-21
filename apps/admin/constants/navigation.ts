import {
  Activity,
  Anvil,
  Calendar,
  ClipboardCheck,
  Code2,
  FileText,
  LifeBuoy,
  Package,
  Library,
  Mail,
  ReceiptText,
  Users,
} from "lucide-react";
import { isAdmin, isPres } from "@uwdsc/common/constants";

export const getAdminNavigation = (
  _position: string | null,
  role?: string | null,
  logisticsWindows?: {
    onboardingOpen: boolean;
  }
) => {
  const onboardingOpen = logisticsWindows?.onboardingOpen ?? false;

  return [
    {
      name: "Members",
      href: "/members",
      icon: Users,
      subItems: [
        { name: "All members", href: "/members", icon: Users },
        { name: "Submissions", href: "/members/submissions", icon: ReceiptText },
      ],
    },
    { name: "Events", href: "/events", icon: Calendar },
    { name: "Support", href: "/support", icon: LifeBuoy },
    ...(isAdmin(role) ? [{ name: "Campaigns", href: "/campaigns", icon: Mail }] : []),
    {
      name: "Logistics",
      href: "/logistics",
      icon: Package,
      subItems: [
        ...(onboardingOpen
          ? [{ name: "Onboarding", href: "/logistics/onboarding", icon: FileText }]
          : []),
        ...(isPres(role)
          ? [
              {
                name: "Onboarding review",
                href: "/logistics/onboarding-review",
                icon: ClipboardCheck,
              },
            ]
          : []),
      ],
    },
    ...(isAdmin(role)
      ? [
          {
            name: "Nexus",
            href: "/nexus",
            icon: Code2,
            subItems: [
              { name: "Foundry", href: "/nexus/foundry", icon: Anvil },
              { name: "Optics", href: "/nexus/optics", icon: Activity },
              { name: "Archives", href: "/nexus/archives", icon: Library },
            ],
          },
        ]
      : []),
  ];
};
