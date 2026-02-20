"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@uwdsc/ui";

export function NavMain({
  items,
}: {
  readonly items: {
    name: string;
    href?: string;
    icon: LucideIcon;
    subItems?: {
      name: string;
      href: string;
    }[];
  }[];
}) {
  const pathname = usePathname();
  const { state, isMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive =
              (item.href && pathname === item.href) ||
              (item.href && pathname.startsWith(`${item.href}/`)) ||
              item.subItems?.some((sub) => pathname === sub.href);

            if (item.subItems?.length) {
              if (state === "collapsed" && !isMobile) {
                return (
                  <SidebarMenuItem key={item.name}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.name}
                          isActive={!!isActive}
                        >
                          <item.icon />
                          <span>{item.name}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200" />
                        </SidebarMenuButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        side="right"
                        align="start"
                        sideOffset={8}
                        className="w-48"
                      >
                        <DropdownMenuLabel>{item.name}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {item.subItems.map((subItem) => (
                          <DropdownMenuItem asChild key={subItem.name}>
                            <Link
                              href={subItem.href}
                              className="cursor-pointer"
                            >
                              {subItem.name}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                );
              }

              return (
                <Collapsible
                  key={item.name}
                  asChild
                  defaultOpen={!!isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.name}
                        isActive={!!isActive}
                      >
                        <item.icon />
                        <span>{item.name}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-[collapsible-up_0.2s_ease-out] data-[state=open]:animate-[collapsible-down_0.2s_ease-out]">
                      <SidebarMenuSub>
                        {item.subItems.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.name}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === subItem.href}
                            >
                              <Link href={subItem.href}>
                                <span>{subItem.name}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            }

            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  isActive={!!isActive}
                  tooltip={item.name}
                >
                  <Link href={item.href as string}>
                    <item.icon />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
