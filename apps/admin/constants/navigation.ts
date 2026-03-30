import {
  Activity,
  Anvil,
  Calendar,
  CircleHelp,
  ClipboardCheck,
  Code2,
  FileText,
  LayoutDashboard,
  Library,
  Shield,
  UserCheck,
  Users,
} from "lucide-react";

export const ADMIN_NAVIGATION = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Members", href: "/members", icon: Users },
  {
    name: "Applications",
    href: "/applications",
    icon: FileText,
    subItems: [
      { name: "Questions", href: "/applications/questions", icon: CircleHelp },
      { name: "Review", href: "/applications/review", icon: ClipboardCheck },
      { name: "Hiring", href: "/applications/hiring", icon: UserCheck },
    ],
  },
  { name: "Events", href: "/events", icon: Calendar },
  { name: "Onboarding", href: "/onboarding", icon: Shield },
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
