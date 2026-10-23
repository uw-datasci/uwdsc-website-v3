import type { ReactNode } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@uwdsc/ui";
import { isAdmin, readRoleClaims } from "@uwdsc/common/constants";
import { createAuthService } from "@/lib/services";
import { RecruitingProvider } from "@/contexts/RecruitingContext";
import { RecruitingShell } from "@/components/recruiting";

export default async function RecruitingLayout({ children }: { readonly children: ReactNode }) {
  const authService = await createAuthService();
  const { user, error } = await authService.getCurrentUser();
  const { role } = readRoleClaims(user?.app_metadata);

  if (error || !user || !isAdmin(role)) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Access restricted</CardTitle>
            <CardDescription>Recruiting is only available to VPs and presidents.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <RecruitingProvider>
      <RecruitingShell>{children}</RecruitingShell>
    </RecruitingProvider>
  );
}
