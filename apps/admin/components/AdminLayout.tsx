"use client";

import { useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@uwdsc/ui";
import { Shield } from "lucide-react";
import { signOut as signOutApi } from "@/lib/api/auth";
import { NavUser } from "./nav/NavUser";
import { NavMain } from "./nav/NavMain";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getAllExecPositions } from "@/lib/api/onboarding";
import { getAdminNavigation } from "@/constants/navigation";

interface AdminLayoutProps {
  readonly children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [positionName, setPositionName] = useState<string | null>(null);

  useEffect(() => {
    const loadPosition = async () => {
      if (!user?.current_role_id || isLoading) return;
      try {
        const positions = await getAllExecPositions();
        const pos = positions.find((p) => p.id === user.current_role_id);
        setPositionName(pos?.name ?? null);
      } catch {
        setPositionName(null);
      }
    };

    loadPosition();
  }, [user?.current_role_id, isLoading]);

  const navigationList = getAdminNavigation(positionName);

  const handleSignOut = async () => {
    try {
      await signOutApi();
    } finally {
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Shield className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-base">
                    Admin Panel
                  </span>
                  <span className="truncate text-xs">UWDSC</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={navigationList} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser onSignOut={handleSignOut} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="overflow-x-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
