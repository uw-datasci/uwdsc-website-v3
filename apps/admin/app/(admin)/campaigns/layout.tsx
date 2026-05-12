import type { ReactNode } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@uwdsc/ui";
import { createAuthService } from "@/lib/services";

export default async function CampaignsLayout({ children }: { readonly children: ReactNode }) {
  const authService = await createAuthService();
  const { user, error } = await authService.getCurrentUser();
  const role = user?.app_metadata?.role as string | undefined;

  if (error || !user || role !== "admin") {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Access restricted</CardTitle>
            <CardDescription>
              Only admin users can view and send email campaigns.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
