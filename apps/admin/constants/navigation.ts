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

export const getAdminNavigation = (
  position: string | null,
  role?: string | null,
) => {
  const isExec = EXEC_POS.some((r) => position?.toLowerCase().includes(r));
  const isAdmin = role === "admin";

  const applicationSubItems = [
    {
      name: "Questions",
      href: "/applications/questions",
      icon: CircleHelp,
    },
    { name: "Hiring", href: "/applications/hiring", icon: UserCheck },
    ...(isAdmin
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
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Members", href: "/members", icon: Users },
    {
      name: "Applications",
      href: "/applications",
      icon: FileText,
      subItems: applicationSubItems,
    },
    { name: "Events", href: "/events", icon: Calendar },
    { name: "Campaigns", href: "/campaigns", icon: Mail },
    {
      name: "Onboarding",
      href: "/onboarding",
      icon: Handshake,
      subItems: [
        {
          name: "Returning",
          href: "/onboarding/returning",
          icon: UserCheck,
        },
        ...(isExec
          ? [{ name: "Review", href: "/onboarding/review", icon: UserCheck }]
          : []),
      ],
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
