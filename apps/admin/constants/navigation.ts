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
  Settings,
  Shield,
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
      { name: "Review", href: "/applications/review", icon: ClipboardCheck },
      { name: "Questions", href: "/applications/questions", icon: CircleHelp },
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
      { name: "Archive", href: "/nexus/archive", icon: Library },
    ],
  },
  { name: "Settings", href: "/settings", icon: Settings },
];
