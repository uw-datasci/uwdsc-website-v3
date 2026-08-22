import {
  Activity,
  Anvil,
  Calendar,
  CircleHelp,
  ClipboardCheck,
  Code2,
  FileText,
  Package,
  Library,
  Mail,
  Settings,
  UserCheck,
  Users,
} from "lucide-react";
import { isAdmin, isPresident } from "@uwdsc/common/constants";

export const getAdminNavigation = (
  _position: string | null,
  role?: string | null,
  logisticsWindows?: {
    onboardingOpen: boolean;
    returningExecOpen: boolean;
  },
) => {
  const onboardingOpen = logisticsWindows?.onboardingOpen ?? false;
  const returningExecOpen = logisticsWindows?.returningExecOpen ?? false;
  const applicationSubItems = [
    {
      name: "Questions",
      href: "/applications/questions",
      icon: CircleHelp,
    },
    ...(isPresident(role)
      ? [
          { name: "Hiring", href: "/applications/hiring", icon: UserCheck },
          {
            name: "Settings",
            href: "/applications/settings",
            icon: Settings,
          },
        ]
      : []),
    ...(isAdmin(role)
      ? [
          {
            name: "Returning Execs",
            href: "/applications/returning-execs",
            icon: UserCheck,
          },
        ]
      : []),
  ];

  return [
    { name: "Members", href: "/members", icon: Users },
    {
      name: "Applications",
      href: "/applications",
      icon: FileText,
      subItems: applicationSubItems,
    },
    { name: "Events", href: "/events", icon: Calendar },
    ...(isAdmin(role) ? [{ name: "Campaigns", href: "/campaigns", icon: Mail }] : []),
    {
      name: "Logistics",
      href: "/logistics",
      icon: Package,
      subItems: [
        ...(onboardingOpen
          ? [
              {
                name: "Onboarding",
                href: "/logistics/onboarding",
                icon: FileText,
              },
            ]
          : []),
        ...(isPresident(role)
          ? [
              {
                name: "Onboarding review",
                href: "/logistics/onboarding-review",
                icon: ClipboardCheck,
              },
            ]
          : []),
        ...(returningExecOpen
          ? [
              {
                name: "Returning execs",
                href: "/logistics/returning",
                icon: UserCheck,
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
