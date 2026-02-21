import { ReactNode } from "react";
import { createAuthService } from "@/lib/services";
import { AdminLayout } from "@/components/AdminLayout";
import { AccessDenied } from "@/components/AccessDenied";
import { ADMIN_ROLES } from "@/constants/roles";

interface AdminLayoutProps {
  readonly children: ReactNode;
}

export default async function AdminPagesLayout({ children }: AdminLayoutProps) {
  const authService = await createAuthService();
  const { user, error } = await authService.getCurrentUser();

  const isAdmin = ADMIN_ROLES.has(user?.app_metadata.role);
  if (error || !isAdmin) return <AccessDenied />;

  return <AdminLayout>{children}</AdminLayout>;
}
