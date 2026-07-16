export interface NavLinkItem {
  href: string;
  label: string;
  target?: string;
  /** Shown before the label on desktop only */
  emoji?: string;
}

export interface NavGroup {
  label: string;
  items: NavLinkItem[];
}

export type NavEntry = NavLinkItem | NavGroup;

export function isNavGroup(entry: NavEntry): entry is NavGroup {
  return "items" in entry;
}
