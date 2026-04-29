import { ReactNode } from "react";
import { createAuthService } from "@/lib/services";
import { AdminLayout } from "@/components/AdminLayout";
import { AccessDenied } from "@/components/AccessDenied";
import { ADMIN_ROLES } from "@/constants/roles";
import { profileService, membershipService } from "@uwdsc/admin";

interface AdminLayoutProps {
  readonly children: ReactNode;
}

export default async function AdminPagesLayout({ children }: AdminLayoutProps) {
  const authService = await createAuthService();
  const { user, error } = await authService.getCurrentUser();

  const role = user?.app_metadata.role as string | undefined;
  if (error || !role || !ADMIN_ROLES.has(role) || !user)
    return <AccessDenied execUnpaid={false} />;

  // For exec users, ensure they have a paid membership row before showing admin pages.
  if (role === "exec") {
    const profile = await profileService.getProfileById(user.id);
    const hasPaid = profile
      ? await membershipService.hasPaidMember(profile.id)
      : false;

    if (!profile || !hasPaid) return <AccessDenied execUnpaid={true} />;
  }

  return <AdminLayout>{children}</AdminLayout>;
}
