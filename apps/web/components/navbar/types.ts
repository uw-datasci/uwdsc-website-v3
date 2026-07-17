import type { LucideIcon } from "lucide-react";

export interface NavLinkItem {
  href: string;
  label: string;
  target?: string;
  icon?: LucideIcon;
}

export interface NavGroup {
  label: string;
  items: NavLinkItem[];
  adminLink?: NavLinkItem;
}

export type NavEntry = NavLinkItem | NavGroup;

export function isNavGroup(entry: NavEntry): entry is NavGroup {
  return "items" in entry;
}
