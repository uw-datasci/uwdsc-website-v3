import { ReactNode } from "react";
import { createAuthService } from "@/lib/services";
import { AdminLayout } from "@/components/AdminLayout";
import { AccessDenied } from "@/components/AccessDenied";
import { ADMIN_ROLES, isAlum } from "@uwdsc/common/constants";
import { membershipService } from "@uwdsc/core";
import { graceDuringOnboarding } from "@/lib/graceDuringOnboarding";

interface AdminLayoutProps {
  readonly children: ReactNode;
}

export default async function AdminPagesLayout({ children }: AdminLayoutProps) {
  const authService = await createAuthService();
  const { user, error } = await authService.getCurrentUser();

  const role = user?.app_metadata.role as string | undefined;

  // Alums only ever reach this layout via /logistics/returning (the proxy redirects them
  // everywhere else to /unauthorized). Render the page directly with no admin nav/sidebar —
  // they get no other admin-app capability.
  if (!error && user && isAlum(role)) return <>{children}</>;

  if (error || !role || !ADMIN_ROLES.has(role) || !user) {
    return <AccessDenied execUnpaid={false} />;
  }

  // For exec users, ensure they have a paid membership row before showing admin pages,
  // except during the active term's onboarding window (unpaid new execs need site access).
  if (role === "exec") {
    const membershipStatus = await membershipService.getMembershipStatus(user.id);
    if (!membershipStatus.has_membership) {
      const grace = await graceDuringOnboarding();
      if (!grace) return <AccessDenied execUnpaid={true} />;
    }
  }

  return <AdminLayout>{children}</AdminLayout>;
}
