import {
  Activity,
  Anvil,
  Calendar,
  CircleHelp,
  Code2,
  FileText,
  Handshake,
  LayoutDashboard,
  Library,
  Mail,
  UserCheck,
  Users,
} from "lucide-react";

const EXEC_POS = ["president", "vp"];

export const getAdminNavigation = (position: string | null) => {
  const isExec = EXEC_POS.some((r) => position?.toLowerCase().includes(r));
  return [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Members", href: "/members", icon: Users },
    {
      name: "Applications",
      href: "/applications",
      icon: FileText,
      subItems: [
        {
          name: "Questions",
          href: "/applications/questions",
          icon: CircleHelp,
        },
        { name: "Hiring", href: "/applications/hiring", icon: UserCheck },
      ],
    },
    { name: "Events", href: "/events", icon: Calendar },
    { name: "Campaigns", href: "/campaigns", icon: Mail },
    {
      name: "Onboarding",
      href: "/onboarding",
      icon: Handshake,
      ...(isExec && {
        subItems: [
          { name: "Review", href: "/onboarding/review", icon: UserCheck },
        ],
      }),
    },
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
  ];
};
