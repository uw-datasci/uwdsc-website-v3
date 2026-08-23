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
  ReceiptText,
  Settings,
  UserCheck,
  Users,
} from "lucide-react";
import { isAdmin, isPres } from "@uwdsc/common/constants";

export const getAdminNavigation = (
  _position: string | null,
  role?: string | null,
  logisticsWindows?: {
    onboardingOpen: boolean;
    returningExecOpen: boolean;
  }
) => {
  const onboardingOpen = logisticsWindows?.onboardingOpen ?? false;
  const returningExecOpen = logisticsWindows?.returningExecOpen ?? false;

  const applicationSubItems = [
    {
      name: "Questions",
      href: "/applications/questions",
      icon: CircleHelp,
    },
    ...(isPres(role)
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
    {
      name: "Members",
      href: "/members",
      icon: Users,
      subItems: [
        { name: "All members", href: "/members", icon: Users },
        // Open to every exec: the online review queue is not admin-only.
        { name: "Submissions", href: "/members/submissions", icon: ReceiptText },
      ],
    },
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
        ...(isPres(role)
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
