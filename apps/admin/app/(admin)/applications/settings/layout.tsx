import type { ReactNode } from "react";
import { isPresident } from "@uwdsc/common/constants";
import { Card, CardDescription, CardHeader, CardTitle } from "@uwdsc/ui";
import { createAuthService } from "@/lib/services";

export default async function ApplicationSettingsLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  const authService = await createAuthService();
  const { user, error } = await authService.getCurrentUser();
  const userIsPresident =
    !error && !!user && isPresident(user.app_metadata?.role as string | undefined);

  if (!userIsPresident) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Access restricted</CardTitle>
            <CardDescription>Only Presidents can manage application settings.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
